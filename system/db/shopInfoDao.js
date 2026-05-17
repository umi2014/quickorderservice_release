const pool = require('../../db/pool'); // 共通化された接続プールをインポート

class ShopInfoDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定した店舗情報を取得
   * @param {number} shopId 店舗ID
   * @returns {Promise} 店舗データ
   */
  async getShopInfoByShopId(shopId) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM shops WHERE SHOP_ID = ? AND DELETE_FLG = '0'";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + shopId);
      const results = await this.pool.query(
        sql, [shopId]);
      if (results && results.length > 0 && results[0].length > 0) {
        console.debug("result:" + results[0].length);
        return results[0][0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch shop by shop ID');
    }
  }
}

module.exports = ShopInfoDao;
