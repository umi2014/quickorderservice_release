const express = require('express');
const router = express.Router();
const LanguageService = require('../service/languageService.js'); // 共通化された接続プールをインポート
const languageService = new LanguageService();

// 商品一覧を取得
router.post('/', async (req, res) => {
  const shopId = req.body.shopId;
  if (!shopId) {
    return res.status(400).json({ error: 'shopId is required' });
  }

  try {
    var languages = await languageService.getLanguagesByShopId(shopId);
    res.json(languages);
  } catch (err) {
    console.error('Error fetching languages:', err.message);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

module.exports = router;
