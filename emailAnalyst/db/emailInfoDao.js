const pool = require('../../db/pool'); // 共通化された接続プールをインポート

class EmailInfoDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定したショップIDのメール一覧を取得
   * @param {Object} joken 条件
   * @returns {Promise<Array>} メール情報の配列
   */
  async getEmailInfoList(joken) {
    try {
      var sql = "SELECT a.EMAIL_ID, a.SHOP_ID, a.EMAIL_ADDRESS, a.SUBJECT, CAST(a.CONTENT AS CHAR(10000) CHARACTER SET utf8) as CONTENT, a.FROM, a.DATE, a.TORIKOMI_FLG, a.DELETE_FLG FROM emails a WHERE a.SHOP_ID = ? ";
      var param = [joken.shopId];

      if (joken.lastEmailId && joken.lastEmailId !== 999999999) {
        sql += " AND a.EMAIL_ID < ? ";
        param.push(joken.lastEmailId);
      }
      if (joken.emailAddress) {
        sql += " AND a.EMAIL_ADDRESS LIKE ? ";
        param.push("%" + joken.emailAddress + "%");
      }
      if (joken.subject) {
        sql += " AND a.SUBJECT LIKE ? ";
        param.push("%" + joken.subject + "%");
      }
      if (joken.content) {
        sql += " AND a.CONTENT LIKE ? ";
        param.push("%" + joken.content + "%");
      }
      if (joken?.TORIKOMI_FLG != null && joken?.TORIKOMI_FLG !== "") {
        sql += " AND a.TORIKOMI_FLG = ? ";
        param.push(joken.TORIKOMI_FLG);
      }
      if (joken?.DELETE_FLG != null && joken?.DELETE_FLG !== "") {
        sql += " AND a.DELETE_FLG = ? ";
        param.push(joken.DELETE_FLG);
      }

      sql += " ORDER BY a.EMAIL_ID DESC ";

      if (joken.getAllFlg) {
      } else if (joken.offset != null) {
        sql += " LIMIT ?, 20 ";
        param.push(Number(joken.offset));
      } else {
        sql += " LIMIT 20 ";
      }

      console.debug("SQL:" + sql);
      console.debug("PARAM:" + param);
      const results = await this.pool.query(sql, param);
      return results[0] || [];
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch Emails');
    }
  }

  /**
   * 指定したショップIDのメール総件数を取得
   * @param {Object} joken 条件
   * @returns {Promise<number>} 総件数
   */
  async getEmailInfoCount(joken) {
    try {
      var sql = "SELECT COUNT(*) AS totalCount FROM emails a WHERE a.SHOP_ID = ? ";
      var param = [joken.shopId];

      if (joken.emailAddress) {
        sql += " AND a.EMAIL_ADDRESS LIKE ? ";
        param.push("%" + joken.emailAddress + "%");
      }
      if (joken.subject) {
        sql += " AND a.SUBJECT LIKE ? ";
        param.push("%" + joken.subject + "%");
      }
      if (joken.content) {
        sql += " AND a.CONTENT LIKE ? ";
        param.push("%" + joken.content + "%");
      }
      if (joken?.TORIKOMI_FLG != null && joken?.TORIKOMI_FLG !== "") {
        sql += " AND a.TORIKOMI_FLG = ? ";
        param.push(joken.TORIKOMI_FLG);
      }
      if (joken?.DELETE_FLG != null && joken?.DELETE_FLG !== "") {
        sql += " AND a.DELETE_FLG = ? ";
        param.push(joken.DELETE_FLG);
      }

      const results = await this.pool.query(sql, param);
      return results[0][0].totalCount;
    } catch (err) {
      console.error('Error executing count query:', err.stack);
      throw new Error('Failed to fetch Emails count');
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
      const results = await this.pool.query(
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
      const results = await this.pool.query(
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
      const results = await this.pool.query(
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
      const results = await this.pool.query(
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

  /**
   * 指定したメール情報が既に存在するか確認
   * @param {Object} email メール情報
   * @returns {Promise<boolean>} 存在すればtrue
   */
  async isEmailExists(email) {
    try {
      var sql = "SELECT COUNT(*) as count FROM emails WHERE SHOP_ID = ? AND SUBJECT = ? AND `FROM` = ? AND DATE = ? ";
      var param = [email.SHOP_ID, email.SUBJECT, email.FROM, email.DATE];
      const results = await this.pool.query(sql, param);
      return (results[0][0].count || 0) > 0;
    } catch (err) {
      console.error('Error checking email existence:', err.stack);
      return false;
    }
  }
}

module.exports = EmailInfoDao;
