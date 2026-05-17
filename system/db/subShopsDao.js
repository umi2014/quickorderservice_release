const pool = require('../../db/pool'); // 共通化された接続プールをインポート

class SubShopsDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定した店舗IDの子店舗一覧を取得
   * @param {number} shopId 店舗ID
   * @returns {Promise<Array>} 子店舗データの配列
   */
  async getSubShopsByShopId(shopId) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM sub_shops WHERE SHOP_ID = ? AND DELETE_FLG = '0'";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + shopId);
      const results = await this.pool.query(
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
      throw new Error('Failed to fetch sub_shops by shop ID');
    }
  }
}

module.exports = SubShopsDao;
