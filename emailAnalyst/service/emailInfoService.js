const imaps = require("imap-simple");
const pool = require('../../db/pool');
const { simpleParser } = require("mailparser");
const EmailSettingDao = require("../db/emailSettingDao.js");
const emailSettingDao = new EmailSettingDao();
const EmailInfoDao = require("../db/emailInfoDao.js");
const emailInfoDao = new EmailInfoDao();
const OrderEmailMappingSettingDao = require("../db/orderEmailMappingSettingDao.js");
const orderEmailMappingSettingDao = new OrderEmailMappingSettingDao();
const TableDao = require("../../system/db/tableDao.js");
const tableDao = new TableDao();
const OrderDao = require("../../order/db/orderDao.js");
const orderDao = new OrderDao();
const OrderDetailDao = require("../../order/db/orderDetailDao.js");
const orderDetailDao = new OrderDetailDao();

class EmailInfoService {
  /**
   * 指定したショップIDのメール設定一覧で、すべてのメールを取込する
   * @param {number} shopId ショップID
   * @returns {message} メッセージ
   */
  async torikomiEmailByShopId(shopId) {
    // 指定したショップIDのメール設定一覧を取得
    var emailSettingList = await emailSettingDao.getEmailSettingsByShopId(shopId);
    for (var i = 0; i < emailSettingList.length; i++) {
      try {
        var emailSetting = emailSettingList[i];
        // IMAP接続設定
        var imap = {};
        imap.user = emailSetting.EMAIL_ADDRESS;
        imap.password = emailSetting.PASSWORD;
        imap.host = emailSetting.RECEIVE_SERVER;
        imap.port = emailSetting.RECEIVE_PORT;
        imap.tls = emailSetting.SSL_TLS_FLG = "1" ? true : false;
        imap.authTimeout = 3000;
        imap.tlsOptions = { rejectUnauthorized: false }; // ← 証明書検証を無効化
        var config = {};
        config.imap = imap;

        console.debug("config:" + JSON.stringify(config));
        const connection = await imaps.connect(config);
        await connection.openBox("INBOX");

        // 过去3天内的邮件を取得
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const searchCriteria = [['SINCE', threeDaysAgo]];
        const fetchOptions = { bodies: ["", "TEXT"], markSeen: false };

        const results = await connection.search(searchCriteria, fetchOptions);

        for (const mail of results) {
          const all = mail.parts.find(p => p.which === "");
          const raw = all.body;

          // mailparser で解析
          const parsed = await simpleParser(Buffer.from(raw, "utf-8"));

          var mailInfo = {};
          mailInfo.SHOP_ID = shopId;
          mailInfo.EMAIL_ADDRESS = emailSetting.EMAIL_ADDRESS;
          mailInfo.SUBJECT = parsed.subject;
          mailInfo.CONTENT = parsed.text;
          mailInfo.FROM = parsed.from.text;
          mailInfo.DATE = mail.attributes.date;

          // 判断是否已经存在
          const exists = await emailInfoDao.isEmailExists(mailInfo);
          if (exists) {
            console.log(`Email already exists, skipping: SUBJECT=${mailInfo.SUBJECT}, DATE=${mailInfo.DATE}`);
            continue;
          }

          await emailInfoDao.insEmailInfo(mailInfo);
          // ---- 既読にする ----
          const uid = mail.attributes.uid;
          await connection.addFlags(uid, ["\\Seen"]);

          console.log(`Marked as read: UID=${uid}`);
        }

        var message = "メールを取り込みし、DBに保存しました";
      } catch (err) {
        console.error(err);
        message = err.message;
      }

    }

    return message;
  }

  /**
   * 指定した条件のメール情報一覧を取得
   * @param {Object} joken 条件
   * @returns {Promise<Array>} メール情報データの配列
   */
  async getEmailInfoList(joken) {

    var emailInfoList = await emailInfoDao.getEmailInfoList(joken);

    return emailInfoList;
  }

  /**
   * 指定したショップIDのメール総件数を取得
   * @param {Object} joken 条件
   * @returns {Promise<number>} 総件数
   */
  async getEmailInfoCount(joken) {
    var count = await emailInfoDao.getEmailInfoCount(joken);
    return count;
  }

  /**
   * 指定したメールIDのメール情報を取得
   * @param mailId メールID
   * @returns {Promise} メール情報数据
   */
  async getEmailInfo(mailId) {

    var emailInfo = await emailInfoDao.getEmailInfo(mailId);

    return emailInfo;
  }

  /**
   * 指定したメールステータスを更新
   * @param {Promise} emailInfo メール情報
   * @returns {number} 更新件数
   */
  async updEmailInfoStatus(emailInfo) {
    var result = await emailInfoDao.updEmailInfoStatus(emailInfo);

    return result;
  }

  /**
   * 指定したメール情報を削除
   * @param {Promise} emailInfo メール設定情報
   * @returns {number} 更新件数
   */
  async delEmailInfo(emailInfo) {
    var result = await emailInfoDao.delEmailInfo(emailInfo);

    return result;
  }

  /**
   * 指定した条件のメールオーダマッピング情報一覧を取得
   * @param {Object} shopId 店ID
   * @returns {Promise<Array>} メールオーダマッピング情報データの配列
   */
  async getOrderEmailMappingSettings(shopId) {

    var orderEmailMappingSettings = await orderEmailMappingSettingDao.getOrderEmailMappingSettingInfo(shopId);

    return orderEmailMappingSettings;
  }

  /**
   * 分析メール情報、注文情報作成
   */
  async analysitMailToOrder(emailInfo, orderEmailMappingSettings) {
    console.debug(`[Start] Parsing Email ID: ${emailInfo.EMAIL_ID}`);

    if (!orderEmailMappingSettings || orderEmailMappingSettings.length < 10) {
      console.error("Mapping settings insufficient");
      return -1;
    }

    try {
      // 1. 获取或创建桌号 ID
      const tableId = await this._getOrCreateTable(emailInfo.SHOP_ID, orderEmailMappingSettings[9].START);

      // 2. 解析邮件内容，提取 Header 和 Details
      emailInfo.CONTENT = emailInfo.SUBJECT + "\r\n" + emailInfo.CONTENT;
      const { orderHeader, detailList } = this._parseEmailContent(emailInfo.CONTENT, orderEmailMappingSettings);

      // 3. 完善订单主表信息
      const systemDate = new Date();
      const orderData = {
        ...orderHeader,
        SHOP_ID: emailInfo.SHOP_ID,
        EMAIL_ID: emailInfo.EMAIL_ID,
        TABLE_ID: tableId,
        YEAR: systemDate.getFullYear(),
        MONTH: systemDate.getMonth() + 1,
        DAY: systemDate.getDate(),
        ORDERED_FLG: "1",
        PAYED_FLG: "1",
        DELETE_FLG: "0",
        ORDER_ID: 0
      };

      await pool.transaction(async () => {
        // 4. 执行持久化（主表 -> 明细表）
        // 这里的 orderDao.insertOrder 必须返回包含 insertId 的对象
        const result = await orderDao.insertOrder(orderData);
        const newOrderId = result.ORDER_ID || result;

        if (newOrderId > 0 && detailList.length > 0) {
          await orderDetailDao.insertOrderDetails(detailList, newOrderId);
          console.debug(`[Success] Order ${newOrderId} saved with ${detailList.length} details.`);
        }
      });
      return 1;
    } catch (error) {
      console.error("[Error] analysis failed:", error);
      throw error;
    }
  }

  /**
     * 解析邮件内容逻辑
     */
  _parseEmailContent(content, settings) {
    const lines = content.split(/\r?\n/);

    // 从配置中自动寻找边界标记
    const areaSetting = settings.find(s => s.SETTING_TYPE === 0);
    const startMarker = areaSetting ? areaSetting.START : null;
    const endMarker = areaSetting ? areaSetting.END : null;

    let orderHeader = { CANCEL_FLG: "0" };
    let detailList = [];
    let currentDetail = null;
    let isInsideProductArea = false;

    // 分类配置，提高解析效率
    const headerSettings = settings.filter(s => ![0, 1, 2, 3].includes(s.SETTING_TYPE));
    const detailSettings = settings.filter(s => [1, 2, 3].includes(s.SETTING_TYPE));

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // --- A. 自动解析 Header 信息 ---
      headerSettings.forEach(set => {
        if (line.includes(set.START)) {
          const val = this._extractValue(line, set);
          // 如果字段名是 CANCEL_FLG，特殊处理
          if (set.FIELD_NAME === 'CANCEL_FLG') {
            orderHeader[set.FIELD_NAME] = "1";
          } else if (set.SETTING_TYPE === 7) {
            // 合计金额特殊逻辑：数值和币种
            orderHeader[set.FIELD_NAME] = this._cleanNum(val);
            const parts = line.split(set.END);
            if (parts[1]) orderHeader.PRICE_CURRENCY = parts[1].trim();
          } else {
            // 根据字段名自动赋值
            orderHeader[set.FIELD_NAME] = set.FIELD_NAME.includes('PRICE') || set.FIELD_NAME.includes('TAX') || set.FIELD_NAME.includes('POSTAGE') || set.FIELD_NAME.includes('AMONT')
              ? this._cleanNum(val)
              : val;
          }
        }
      });

      // --- B. 边界切换 ---
      if (startMarker && line.includes(startMarker)) { isInsideProductArea = true; continue; }
      if (isInsideProductArea && line === endMarker) { isInsideProductArea = false; break; }

      // --- C. 自动解析明细信息 ---
      if (isInsideProductArea) {
        // 遇到 SETTING_TYPE 为 1 的配置，开启新商品
        const prodNameSetting = settings.find(s => s.SETTING_TYPE === 1);
        if (line.includes(prodNameSetting.START)) {
          if (currentDetail) detailList.push(currentDetail);
          currentDetail = {
            [prodNameSetting.FIELD_NAME]: this._extractValue(line, prodNameSetting)
          };
        }
        else if (currentDetail) {
          // 遍历所有属于明细的配置（单价、数量等）
          detailSettings.filter(s => s.SETTING_TYPE !== 1).forEach(set => {
            if (line.includes(set.START)) {
              // if (set.SETTING_TYPE === 3) { // 单价的正则特殊处理
              //    const afterStart = line.split(set.START)[1];
              //    const match = afterStart.match(/^\s*(\d+)/);
              //    if (match) currentDetail[set.FIELD_NAME] = match[1];
              // } else {
              const val = this._extractValue(line, set);
              currentDetail[set.FIELD_NAME] = this._cleanNum(val);
              // }
            }
          });
        }
      }
    }
    headerSettings.forEach(set => {
      // 備考
      if (set.FIELD_NAME === 'MEMO') {
        if (content.includes(set.START)) {
          const val = this._extractValue(content, set);
          orderHeader[set.FIELD_NAME] = val;
        }
      } else if (set.FIELD_NAME === 'ORDER_UPDATE_FLG') {
        // 変更フラグ
        if (content.includes(set.START)) {
          orderHeader[set.FIELD_NAME] = "1";
        }
      } else if (set.FIELD_NAME === 'ORDER_UPDATE_MEMO') {
        // 変更内容
        if (content.includes(set.START)) {
          const val = this._extractValue(content, set);
          orderHeader[set.FIELD_NAME] = val;
        }
      } else if (set.FIELD_NAME === 'ORDER_NAME') {
        // 変更内容
        if (content.includes(set.START)) {
          orderHeader[set.FIELD_NAME] = set.DEFAULT_VALUE;
        }
      }
    });
    if (currentDetail) {
      detailList.push(currentDetail);
    } else {
      orderHeader["ORDER_UPDATE_FLG"] = "1";
    }
    return { orderHeader, detailList };
  }

  /**
   * 共通的提取逻辑
   */
  _extractValue(line, setting) {
    try {
      if (!line.includes(setting.START)) return "";
      const temp = line.split(setting.START)[1];
      if (setting.END && temp.includes(setting.END)) {
        return temp.split(setting.END)[0].trim();
      }
      return temp.trim(); // 没有结束符则取剩余全部
    } catch (e) {
      return "";
    }
  }

  // 辅助工具：字段匹配
  _mapField(line, setting, callback) {
    if (line.includes(setting.START)) {
      const val = line.split(setting.START)[1].split(setting.END)[0];
      callback(val);
    }
  }

  // 辅助工具：提取纯数字
  _cleanNum(str) {
    return str ? str.replace(/[^\d.-]/g, '') : "0";
  }

  // 辅助工具：桌号处理
  async _getOrCreateTable(shopId, tableName) {
    const joken = { SHOP_ID: shopId, TABLE_NAME: tableName };
    let list = await tableDao.getTableInfoList(joken);
    if (list.length === 0) {
      await tableDao.insTableInfo(joken);
      list = await tableDao.getTableInfoList(joken);
    }
    return list.length > 0 ? list[0].TABLE_ID : null;
  }
}

module.exports = EmailInfoService;
