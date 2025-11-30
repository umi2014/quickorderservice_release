const pool = require('./pool'); // 共通化された接続プールをインポート

class EmailSettingDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定したショップIDのメール設定一覧を取得
   * @param {number} shopId ショップID
   * @returns {Promise<Array>} メール設定データの配列
   */
  async getEmailSettingsByShopId(shopId) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM email_settings WHERE SHOP_ID = ? ";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + shopId);
      const results = await this.pool.promise().query(
        sql, [shopId]);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch EmailSettings by shop ID');
    }
  }

  /**
   * 指定したメール設定を挿入
   * @param {Promise} emailSetting メール設定情報
   * @returns 挿入件数
   */
  async insEmailSetting(emailSetting) {
    try {
      // クエリの実行
      var sql = "INSERT INTO email_settings(`SHOP_ID`, `EMAIL_ADDRESS`, `PASSWORD`, `RECEIVE_SERVER`, `RECEIVE_PORT`, `SEND_SERVER`, `SEND_PORT`, `SSL_TLS_FLG`, `RECEIVE_SPA_AUTH_FLG`, `ENCRYPTION_METHOD`, `SEND_SPA_AUTH_FLG`, `DELETE_FLG`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      console.debug("SQL:" + sql);
      var param = [emailSetting.SHOP_ID, emailSetting.EMAIL_ADDRESS, emailSetting.PASSWORD, emailSetting.RECEIVE_SERVER, emailSetting.RECEIVE_PORT, emailSetting.SEND_SERVER, emailSetting.SEND_PORT, emailSetting.SSL_TLS_FLG, emailSetting.RECEIVE_SPA_AUTH_FLG, emailSetting.ENCRYPTION_METHOD, emailSetting.SEND_SPA_AUTH_FLG, "0"];
      console.debug("PARAM:" + param);
      const results = await this.pool.promise().query(
        sql, param);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to insert EmailSettings');
    }
  }

  /**
   * 指定したメール設定情報を更新
   * @param {Promise} emailSetting メール設定情報
   * @returns 挿入件数
   */
  async updEmailSetting(emailSetting) {
    try {
      // クエリの実行
      var sql = "UPDATE email_settings SET EMAIL_ADDRESS=?,PASSWORD=?,RECEIVE_SERVER=?,RECEIVE_PORT=?,SEND_SERVER=?,SEND_PORT=?,SSL_TLS_FLG=?,RECEIVE_SPA_AUTH_FLG=?,ENCRYPTION_METHOD=?,SEND_SPA_AUTH_FLG=? WHERE EMAIL_SETTING_ID = ? ";
      console.debug("SQL:" + sql);
      var param = [emailSetting.EMAIL_ADDRESS, emailSetting.PASSWORD, emailSetting.RECEIVE_SERVER, emailSetting.RECEIVE_PORT, emailSetting.SEND_SERVER, emailSetting.SEND_PORT, emailSetting.SSL_TLS_FLG, emailSetting.RECEIVE_SPA_AUTH_FLG, emailSetting.ENCRYPTION_METHOD, emailSetting.SEND_SPA_AUTH_FLG, emailSetting.EMAIL_SETTING_ID];
      console.debug("PARAM:" + param);
      const results = await this.pool.promise().query(
        sql, param);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to update EmailSettings by shop ID');
    }
  }

  /**
   * 指定したメール設定情報を削除
   * @param {Promise} emailSetting メール設定情報
   * @returns 挿入件数
   */
  async delEmailSetting(emailSetting) {
    try {
      // クエリの実行
      var sql = "DELETE from email_settings WHERE EMAIL_SETTING_ID = ? ";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + emailSetting.EMAIL_SETTING_ID);
      const results = await this.pool.promise().query(
        sql, [emailSetting.EMAIL_SETTING_ID]);
      if (results && results.length > 0) {
        console.debug("result:" + results[0]);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to delete EmailSettings by EMAIL_SETTING_ID');
    }
  }
}

module.exports = EmailSettingDao;
