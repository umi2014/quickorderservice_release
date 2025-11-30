const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const EmailSettingDao = require("../db/emailSettingDao.js");
const emailSettingDao = new EmailSettingDao();
const EmailInfoDao = require("../db/emailInfoDao.js");
const emailInfoDao = new EmailInfoDao();
const OrderEmailMappingSettingDao = require("../db/orderEmailMappingSettingDao.js");
const orderEmailMappingSettingDao = new OrderEmailMappingSettingDao();
const TableDao = require("../db/tableDao.js");
const tableDao = new TableDao();
const OrderDao = require("../db/orderDao.js");
const orderDao = new OrderDao();

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

        // 最新メール 10件を取得
        const searchCriteria = ["UNSEEN"];
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
          mailInfo.DATE = new Date();
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
   * 指定したメールIDのメール情報を取得
   * @param mailId メールID
   * @returns {Promise} メール情報データ
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
   * 指定したメール情報をオーダ情報に取り込む
   * @param {Promise} emailInfo メール情報
   * @param {Promise} orderEmailMappingSettings メール設定情報リスト
   * @returns {number} 更新件数
   */
  async analysitMailToOrder(emailInfo, orderEmailMappingSettings) {
    var orderInfo = {};
    console.debug("analysitMailToOrder start:" + emailInfo);
    if (orderEmailMappingSettings.length < 10) {
      return null;
    }
    var start = orderEmailMappingSettings[0].START;
    var end = orderEmailMappingSettings[0].END;
    orderInfo.EMAIL_ID = emailInfo.EMAIL_ID;
    orderInfo.SHOP_ID = emailInfo.SHOP_ID;
    var mailContents = emailInfo.CONTENT.split("\r\n");
    if (mailContents.length == 1) {
      mailContents = emailInfo.CONTENT.split("\n");
    }
    var joken = {};
    joken.SHOP_ID = emailInfo.SHOP_ID;
    joken.TABLE_NAME = orderEmailMappingSettings[9].START;
    var tableList = await tableDao.getTableInfoList(joken)
    if (tableList.length > 0) {
      orderInfo.TABLE_ID = tableList[0].TABLE_ID;
    } else {
      await tableDao.insTableInfo(joken)
      tableList = await tableDao.getTableInfoList(joken)
      if (tableList.length > 0) {
        orderInfo.TABLE_ID = tableList[0].TABLE_ID;
      } else {
        return;
      }
    }
    var taishoFlg = 0;
    orderInfo.CANCEL_FLG = "0";
    for (var i = 0; i < mailContents.length; i++) {
      var content = mailContents[i];
      console.debug("content:" + content);
      // 8:キー情報
      if (content.includes(orderEmailMappingSettings[8].START)) {
        var amont = content.split(orderEmailMappingSettings[8].START);
        amont = amont[1].split(orderEmailMappingSettings[8].END)
        orderInfo.ORDER_KEY = amont[0];
        console.debug("8:キー情報:" + orderInfo.ORDER_KEY);
      }
      // 10:▼キャンセル理由
      if (content.includes(orderEmailMappingSettings[10].START)) {
        orderInfo.CANCEL_FLG = "1";
        console.debug("10:▼キャンセル理由:" + orderInfo.CANCEL_FLG);
      }
      if (content.includes(start)) {
        console.debug("start:" + start);
        taishoFlg = 1;
      }
      if (taishoFlg == 1 && content == end) {
        console.debug("end:" + end);
        break;
      }
      if (taishoFlg == 1) {
        // 1:商品名
        if (content.includes(orderEmailMappingSettings[1].START)) {
          var amont = content.split(orderEmailMappingSettings[1].START);
          amont = amont[1].split(orderEmailMappingSettings[1].END)
          orderInfo.PRODUCT_NAME = amont[0];
          console.debug("1:商品名:" + orderInfo.PRODUCT_NAME);
        }
        // 2:単価
        else if (content.includes(orderEmailMappingSettings[2].START)) {
          var amont = content.split(orderEmailMappingSettings[2].START);
          amont = amont[1].split(orderEmailMappingSettings[2].END)
          orderInfo.PRICE = amont[0].replace(/[^\d.-]/g, '');
          console.debug("2:単価:" + orderInfo.PRICE);
        }
        // 3:数量
        if (content.includes(orderEmailMappingSettings[3].START)) {
          var amont = content.split(orderEmailMappingSettings[3].START);
          amont = amont[1].split(orderEmailMappingSettings[3].END)
          orderInfo.NUMBER = amont[0].replace(/[^\d.-]/g, '');
          console.debug("3:数量:" + orderInfo.NUMBER);
        }
        // 4:送料
        else if (content.includes(orderEmailMappingSettings[4].START)) {
          var amont = content.split(orderEmailMappingSettings[4].START);
          amont = amont[1].split(orderEmailMappingSettings[4].END)
          orderInfo.POSTAGE = amont[0].replace(/[^\d.-]/g, '');
          console.debug("4:送料:" + orderInfo.POSTAGE);
        }
        // 5:追加料金
        else if (content.includes(orderEmailMappingSettings[5].START)) {
          var amont = content.split(orderEmailMappingSettings[5].START);
          amont = amont[1].split(orderEmailMappingSettings[5].END)
          orderInfo.ADDTIONAl_PRICE = amont[0].replace(/[^\d.-]/g, '');
          console.debug("5:追加料金:" + orderInfo.ADDTIONAl_PRICE);
        }
        // 6:税金
        else if (content.includes(orderEmailMappingSettings[6].START)) {
          var amont = content.split(orderEmailMappingSettings[6].START);
          amont = amont[1].split(orderEmailMappingSettings[6].END)
          orderInfo.TAX = amont[0].replace(/[^\d.-]/g, '');
          console.debug("6:税金:" + orderInfo.TAX);
        }
        // 7:合計金額
        else if (content.includes(orderEmailMappingSettings[7].START)) {
          var amont = content.split(orderEmailMappingSettings[7].START);
          amont = amont[1].split(orderEmailMappingSettings[7].END)
          orderInfo.AMONT = amont[0].replace(/[^\d.-]/g, '');
          orderInfo.PRICE_CURRENCY = amont[1].replace(/[^\d.-]/g, '');
          console.debug("7:合計金額:" + orderInfo.AMONT);
        }
      }
    }
    if (taishoFlg == 1) {
      var systemDate = new Date();
      orderInfo.YEAR = systemDate.getFullYear();
      orderInfo.MONTH = systemDate.getMonth() + 1;
      orderInfo.DAY = systemDate.getDate();
      orderInfo.ORDERED_FLG = "1";
      orderInfo.PAYED_FLG = "1";
      orderInfo.DELETE_FLG = "0";
      var result = await orderDao.insertOrder(orderInfo);
    }
    return result;
  }
}

module.exports = EmailInfoService;
