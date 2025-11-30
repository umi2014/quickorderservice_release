const EmailSettingDao = require("../db/emailSettingDao.js");
const emailSettingDao = new EmailSettingDao();

class EmailSettingService {
  /**
   * 指定したショップIDのメール設定一覧を取得
   * @param {number} shopId ショップID
   * @returns {Promise<Array>} メール設定データの配列
   */
  async getEmailSettingsByShopId(shopId) {
    var emailSettingList = await emailSettingDao.getEmailSettingsByShopId(shopId);

    return emailSettingList;
  }

  /**
   * 指定したメール設定情報を挿入
   * @param {Promise} emailSetting メール設定情報
   * @returns {number} 更新件数
   */
  async insEmailSetting(emailSetting) {
    var result = await emailSettingDao.insEmailSetting(emailSetting);

    return result;
  }

  /**
   * 指定したメール設定情報を更新
   * @param {Promise} emailSetting メール設定情報
   * @returns {number} 更新件数
   */
  async updEmailSetting(emailSetting) {
    var result = await emailSettingDao.updEmailSetting(emailSetting);

    return result;
  }

  /**
   * 指定したメール設定情報を削除
   * @param {Promise} emailSetting メール設定情報
   * @returns {number} 更新件数
   */
  async delEmailSetting(emailSetting) {
    var result = await emailSettingDao.delEmailSetting(emailSetting);

    return result;
  }
}

module.exports = EmailSettingService;
