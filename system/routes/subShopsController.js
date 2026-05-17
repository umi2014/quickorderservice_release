const express = require('express');
const router = express.Router();
const SubShopsService = require('../service/subShposService.js'); // 共通化された接続プールをインポート
const subShopsService = new SubShopsService();

// サブショップ一覧を取得
router.post('/get', async (req, res) => {
  const shopId = req.body.shopId;
  if (!shopId) {
    return res.status(400).json({ error: 'shopId is required' });
  }

  try {
    var subShops = await subShopsService.getSubShopsByShopId(shopId);
    res.json(subShops);
  } catch (err) {
    console.error('Error fetching languages:', err.message);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
});

module.exports = router;
