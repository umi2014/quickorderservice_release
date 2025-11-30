const pool = require('./pool'); // 共通化された接続プールをインポート

class TableDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定した条件のテーブル一覧を取得
   * @param {Object} joken 条件
   * @returns {Promise<Array>} テーブルデータの配列
   */
  async getTableInfoList(joken) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM tables WHERE SHOP_ID = ? ";
      var param = [];
      param.push(joken.SHOP_ID);
      if (joken?.TABLE_NAME != null && joken?.TABLE_NAME != "") {
        sql += "and TABLE_NAME = ?";
        param.push(joken.TABLE_NAME)
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
      throw new Error('Failed to fetch Tables by shop ID');
    }
  }

  /**
   * 指定したテーブルを挿入
   * @param {Promise} table テーブル情報
   * @returns 挿入件数
   */
  async insTableInfo(table) {
    try {
      // クエリの実行
      var sql = "INSERT INTO tables(`SHOP_ID`, `TABLE_ICON`, `TABLE_NAME`, `TABLE_MESSAGE`, `DELETE_FLG`) VALUES (?, ?, ?, ?, ?);";
      console.debug("SQL:" + sql);
      var param = [table.SHOP_ID, table.TABLE_ICON, table.TABLE_NAME, table.TABLE_MESSAGE, "0"];
      console.debug("PARAM:" + param);
      const results = await this.pool.promise().query(sql, param);

      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to insert tables');
    }
  }

  /**
   * 指定したテーブル情報を更新
   * @param {Promise} table テーブル情報
   * @returns 挿入件数
   */
  async updTableInfo(table) {
    try {
      // クエリの実行
      var sql = "UPDATE tables SET TABLE_ICON=?, TABLE_NAME=?, TABLE_MESSAGE=?, DELETE_FLG=?  WHERE TABLE_ID = ? ";
      console.debug("SQL:" + sql);
      var param = [table.TABLE_ICON, table.TABLE_NAME, table.TABLE_MESSAGE, table.DELETE_FLG, table.TABLE_ID];
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
      throw new Error('Failed to update tables by shop ID');
    }
  }

  /**
   * 指定したテーブル情報を削除
   * @param {Promise} table テーブル情報
   * @returns 更新件数
   */
  async delTableInfo(table) {
    try {
      // クエリの実行
      var sql = "DELETE from tables WHERE TABLE_ID = ? ";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + table.TABLE_ID);
      const results = await this.pool.promise().query(
        sql, [table.TABLE_ID]);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to delete tables by EMAIL_ID');
    }
  }
}

module.exports = TableDao;
