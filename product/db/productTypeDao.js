const pool = require('../../db/pool'); // 共通化された接続プールをインポート

class ProductTypeDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定したショップIDとシステム言語の商品カテゴリ一覧を取得
   * @param {number} shopId ショップID
   * @param {string} languageType 言語タイプ（0: 日文, 1: 中文）
   * @returns {Promise<Array>} カテゴリデータの配列
   */
  async getProductTypesByShopIdAndLanguage(shopId, languageType) {
    try {
      // クエリの実行
      var sql = "SELECT * FROM product_types WHERE SHOP_ID = ? AND LANGUAGE_TYPE = ? ORDER BY PRODUCT_TYPE ASC";
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + shopId + ", " + languageType);
      const results = await this.pool.query(
        sql, [shopId, languageType]);
      if (results && results.length > 0){
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return [];
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch product types by shop ID and language');
    }
  }
}

module.exports = ProductTypeDao;
