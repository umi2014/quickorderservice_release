const pool = require('./pool'); // 共通化された接続プールをインポート

class OrderEmailMappingSetting {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定したショップIDのオーダメールマッピン設定情報を取得
   * @param {number} shopId オーダID
   * @returns {Promise<Array>} オーダメールマッピン設定データの配列
   */
  async getOrderEmailMappingSettingInfo(shopId) {
    try {
      // クエリの実行
      var sql = "select * from order_email_mapping_settings " +
        "where SHOP_ID=? " +
        "order by SETTING_TYPE ";
      var params = [shopId];
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + params);
      const results = await this.pool.promise().query(sql, params);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch OrderEmailMappingSetting by order ID');
    }
  }
}

module.exports = OrderEmailMappingSetting;
