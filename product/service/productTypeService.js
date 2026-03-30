const ProductTypeDao = require("../db/productTypeDao");
const productTypeDao = new ProductTypeDao();

class ProductTypeService {
  /**
   * 指定したショップIDとシステム言語の商品カテゴリ一覧を取得
   * @param {number} shopId ショップID
   * @param {string} languageType 言語タイプ
   * @returns {Promise<Array>} カテゴリデータの配列
   */
  async getProductTypes(shopId, languageType) {
    if (!languageType) {
        languageType = "0"; // デフォルトは日本語
    }
    var typeList = await productTypeDao.getProductTypesByShopIdAndLanguage(shopId, languageType);
    return typeList;
  }
}

module.exports = ProductTypeService;
