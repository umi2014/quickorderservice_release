const pool = require('../../db/pool'); // 共通化された接続プールをインポート

class ProductsDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定したショップIDの商品一覧を取得
   * @param {number} joken 検索条件
   * @returns {Promise<Array>} 商品データの配列
   */
  async getProductsByShopId(joken) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM products WHERE SHOP_ID = ? ";
      var params = [joken.shopId];
      if (joken.productType) {
        sql += "and PRODUCT_TYPE = ? ";
        params.push(joken.productType);
      }
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + params);
      const results = await this.pool.query(sql, params);
      if (results && results.length > 0) {
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
