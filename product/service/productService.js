const ProductsDao = require("../db/productsDao");
const ProductsLanguageDao = require("../db/productsLanguageDao");
const productsDao = new ProductsDao();
const productsLanguageDao = new ProductsLanguageDao();

class ProductService {
  /**
   * 指定したショップIDの商品一覧を取得
   * @param {number} joken 検索条件
   * @returns {Promise<Array>} 商品データの配列
   */
  async getProductsByShopId(joken) {
    var productList = await productsDao.getProductsByShopId(joken);
    if (productList && productList.length > 0) {
      for (var i = 0; i < productList.length; i++) {
        var element = productList[i];
        var language = await productsLanguageDao.getLanguagesByProductId(element.PRODUCT_ID);
        if (language && language.length > 0) {
          productList[i].language = language;
        }
      }
    }

    return productList;
  }
}

module.exports = ProductService;
