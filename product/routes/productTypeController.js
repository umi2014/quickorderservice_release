const express = require('express');
const router = express.Router();
const ProductTypeService = require('../service/productTypeService');
const productTypeService = new ProductTypeService();

// 商品カテゴリ一覧を取得
router.post('/', async (req, res) => {
  const shopId = req.body.shopId;
  const languageType = req.body.languageType;
  if (!shopId) {
    return res.status(400).json({ error: 'shopId is required' });
  }

  try {
    var types = await productTypeService.getProductTypes(shopId, languageType);
    res.json(types);
  } catch (err) {
    console.error('Error fetching product types:', err.stack);
    res.status(500).json({ error: 'Failed to fetch product types', details: err.message });
  }
});

module.exports = router;
