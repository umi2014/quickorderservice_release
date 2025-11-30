const pool = require('./pool'); // 共通化された接続プールをインポート

class EmailInfoDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定したショップIDのメール一覧を取得
   * @param {Object} joken ショップID
   * @returns {Promise<Array>} メール設定データの配列
   */
  async getEmailInfoList(joken) {
    try {
      // クエリの実行
      var sql = "SELECT a.EMAIL_ID,a.SHOP_ID,a.EMAIL_ADDRESS,a.SUBJECT,CAST(a.CONTENT AS CHAR(10000) CHARACTER SET utf8) as CONTENT,a.FROM,a.DATE,a.TORIKOMI_FLG,a.DELETE_FLG FROM emails a WHERE a.SHOP_ID = ? ";
      var param = [];
      param.push(joken.shopId);
      if (joken?.TORIKOMI_FLG != null && joken?.TORIKOMI_FLG != "") {
        sql += "and a.TORIKOMI_FLG = ?";
        param.push(joken.TORIKOMI_FLG)
      }
      if (joken?.DELETE_FLG != null && joken?.DELETE_FLG != "") {
        sql += "and a.DELETE_FLG = ?";
        param.push(joken.DELETE_FLG)
      }
      if (joken?.SUBJECT != null && joken?.SUBJECT != "") {
        sql += "and a.SUBJECT like '%?%'";
        param.push(joken.SUBJECT)
      }
      console.debug("SQL:" + sql);
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
      throw new Error('Failed to fetch Emails by shop ID');
    }
  }

  /**
   * 指定したメールIDのメール情報を取得
   * @param mailId メールID
   * @returns {Promise} メール設定データ
   */
  async getEmailInfo(mailId) {
    try {
      // クエリの実行
      var sql = "SELECT a.EMAIL_ID,a.SHOP_ID,a.EMAIL_ADDRESS,a.SUBJECT,CAST(a.CONTENT AS CHAR(10000) CHARACTER SET utf8) as CONTENT,a.FROM,a.DATE,a.TORIKOMI_FLG,a.DELETE_FLG FROM emails a WHERE a.EMAIL_ID = ? ";
      var param = [];
      param.push(mailId);
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + param);
      const results = await this.pool.promise().query(
        sql, param);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0][0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch Emails by email ID');
    }
  }

  /**
   * 指定したメールを挿入
   * @param {Promise} email メール情報
   * @returns 挿入件数
   */
  async insEmailInfo(email) {
    try {
      // クエリの実行
      var sql = "INSERT INTO emails(`SHOP_ID`, `EMAIL_ADDRESS`, `SUBJECT`, `CONTENT`, `FROM`, `DATE`, `TORIKOMI_FLG`, `DELETE_FLG`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
      console.debug("SQL:" + sql);
      var param = [email.SHOP_ID, email.EMAIL_ADDRESS, email.SUBJECT, email.CONTENT, email.FROM, email.DATE, "0", "0"];
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
      throw new Error('Failed to insert Email');
    }
  }

  /**
   * 指定したメール取り込みフラグを更新
   * @param {Promise} email メール情報
   * @returns 挿入件数
   */
  async updEmailInfoStatus(email) {
    try {
      // クエリの実行
      var sql = "UPDATE emails SET TORIKOMI_FLG=? WHERE EMAIL_ID = ? ";
      console.debug("SQL:" + sql);
      var param = [email.TORIKOMI_FLG, email.EMAIL_ID];
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
      throw new Error('Failed to update Emails by shop ID');
    }
  }

  /**
   * 指定したメール情報を削除
   * @param {Promise} email メール情報
   * @returns 挿入件数
   */
  async delEmailInfo(email) {
    try {
      // クエリの実行
      var sql = "DELETE from emails WHERE EMAIL_ID = ? ";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + email.EMAIL_ID);
      const results = await this.pool.promise().query(
        sql, [email.EMAIL_ID]);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to delete Emails by EMAIL_ID');
    }
  }
}

module.exports = EmailInfoDao;
