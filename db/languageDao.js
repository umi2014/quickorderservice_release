const pool = require('./pool'); // 共通化された接続プールをインポート

class LanguageDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定した店舗IDの言語一覧を取得
   * @param {number} shopId 店舗ID
   * @returns {Promise<Array>} 言語データの配列
   */
  async getLanguagesByShopId(shopId) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM languages WHERE SHOP_ID in (0,?)";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + shopId);
      const results = await this.pool.promise().query(
        sql, [shopId]);
      if (results && results.length > 0){
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch products by shop ID');
    }
  }
}

module.exports = LanguageDao;
