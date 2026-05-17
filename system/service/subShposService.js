const SubShopsDao = require("../db/subShopsDao.js");
const subShopsDao = new SubShopsDao();

class SubShopsService {
  /**
   * 指定したショップIDの商品一覧を取得
   * @param {number} shopId ショップID
   * @returns {Promise<Array>} 商品データの配列
   */
  async getSubShopsByShopId(shopId) {
    var subShopsList = await subShopsDao.getSubShopsByShopId(shopId);

    return subShopsList;
  }
}

module.exports = SubShopsService;
