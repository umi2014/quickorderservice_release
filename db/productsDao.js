const pool = require('./pool'); // 共通化された接続プールをインポート

class ProductsDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定したショップIDの商品一覧を取得
   * @param {number} shopId ショップID
   * @returns {Promise<Array>} 商品データの配列
   */
  async getProductsByShopId(shopId) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM products WHERE SHOP_ID = ? ";
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

module.exports = ProductsDao;
