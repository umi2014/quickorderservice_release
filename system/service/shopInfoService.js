const ShopInfoDao = require("../db/shopInfoDao.js");
const shopInfoDao = new ShopInfoDao();

class ShopInfoService {
  /**
   * 指定したショップIDの店舗情報を取得
   * @param {number} shopId ショップID
   * @returns {Promise} 店舗情報
   */
  async getShopInfoByShopId(shopId) {
    var shopInfo = await shopInfoDao.getShopInfoByShopId(shopId);

    return shopInfo;
  }
}

module.exports = ShopInfoService;
