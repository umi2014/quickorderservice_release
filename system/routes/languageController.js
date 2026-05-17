const express = require('express');
const router = express.Router();
const LanguageService = require('../service/languageService.js'); // 言語一覧取得サービス
const languageService = new LanguageService();
const ShopInfoService = require('../service/shopInfoService.js'); // 店舗情報取得サービス
const shopInfoService = new ShopInfoService();

// 初期表示コントローラー
router.post('/', async (req, res) => {
  const shopId = req.body.shopId;
  if (!shopId) {
    return res.status(400).json({ error: 'shopId is required' });
  }

  try {
    var result = {};
    // 言語一覧取得
    var languages = await languageService.getLanguagesByShopId(shopId);
    result.languageList = languages;
    // 店舗情報取得
    var shopInfo = await shopInfoService.getShopInfoByShopId(shopId);
    result.isOnlinePaymentEnabled = shopInfo.ONLINE_PAYMENT_FLG;
    result.applicationId = shopInfo.APPLICATION_ID;
    result.locationId = shopInfo.LOCATION_ID;
    result.paymentUrl = shopInfo.PAYMENT_URL;
    res.json(result);
  } catch (err) {
    console.error('Error init shop info:', err.message);
    res.status(500).json({ error: 'Failed to fetch init shop info' });
  }
});

module.exports = router;
