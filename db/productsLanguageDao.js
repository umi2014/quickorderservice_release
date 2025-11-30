const pool = require('./pool'); // 共通化された接続プールをインポート

class ProductsLanguageDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定した商品IDの商品言語一覧を取得
   * @param {number} productId 商品ID
   * @returns {Promise<Array>} 商品言語データの配列
   */
  async getLanguagesByProductId(productId) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM product_language WHERE PRODUCT_ID = ? order by LANGUAGE_TYPE";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + productId );
      const results = await this.pool.promise().query(
        sql, [productId]);
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

module.exports = ProductsLanguageDao;
