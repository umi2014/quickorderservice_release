const express = require('express');
const router = express.Router();
const ProductService = require('../service/productService'); // 共通化された接続プールをインポート
const productService = new ProductService();

// 商品一覧を取得
router.post('/', async (req, res) => {
  const shopId = req.body.shopId;
  const languageType = req.body.languageType;
  if (!shopId) {
    return res.status(400).json({ error: 'shopId is required' });
  }

  try {
    var products = await productService.getProductsByShopId(shopId, languageType);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
