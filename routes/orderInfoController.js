const express = require('express');
const router = express.Router();
const OrderService = require('../service/orderService.js'); // 共通化された接続プールをインポート
const orderService = new OrderService();

// オーダ一覧を検索する
router.post('/01/', async (req, res) => {
  const joken = req.body.joken?._value;
  console.debug('joken:', joken);
  if (!joken) {
    return res.status(400).json({ error: 'joken is required' });
  }

  try {
    var orderInfors = await orderService.searchOrderInfo(joken);
    res.json(orderInfors);
  } catch (err) {
    console.error('Error fetching orderInfors:', err.message);
    res.status(500).json({ error: 'Failed to fetch orderInfors' });
  }
});

module.exports = router;
