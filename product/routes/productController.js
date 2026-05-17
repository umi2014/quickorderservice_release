const express = require('express');
const router = express.Router();
const ProductService = require('../service/productService'); // 共通化された接続プールをインポート
const productService = new ProductService();

// 商品一覧を取得
router.post('/', async (req, res) => {
  let joken = {};
  joken.shopId = req.body.shopId;
  joken.languageType = req.body.languageType;
  joken.productType = req.body.productType;
  if (!joken.shopId) {
    return res.status(400).json({ error: 'shopId is required' });
  }

  try {
    var products = await productService.getProductsByShopId(joken);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
