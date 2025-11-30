const LanguageDao = require("../db/languageDao.js");
const languageDao = new LanguageDao();

class LanguageService {
  /**
   * 指定したショップIDの商品一覧を取得
   * @param {number} shopId ショップID
   * @returns {Promise<Array>} 商品データの配列
   */
  async getLanguagesByShopId(shopId) {
    var languageList = await languageDao.getLanguagesByShopId(shopId);

    return languageList;
  }
}

module.exports = LanguageService;
