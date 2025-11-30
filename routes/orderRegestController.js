const express = require('express');
const router = express.Router();
const OrderService = require('../service/orderService.js'); // 共通化された接続プールをインポート
const orderService = new OrderService();

// オーダーを作成する
router.post('/', async (req, res) => {
  const orderInfo = req.body.orderInfo;
  var inputCheckResult = inputCheck(orderInfo);
  if (!inputCheckResult) {
    return res.status(400).json({ error: 'orderInfo is required' });
  }

  try {
    var newOrderInfo = await orderService.addNewOrder(orderInfo);
    res.json(newOrderInfo);
  } catch (err) {
    console.error('Error fetching Orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch Orders' });
  }
});

function inputCheck(orderInfo) {
  var result = true;
  if (orderInfo?.SHOP_ID == null) {
    result = false;
    console.error('Error inputCheck Orders:', "SHOP_ID is null");
  }
  if (orderInfo?.TABLE_ID == null) {
    result = false;
    console.error('Error inputCheck Orders:', "TABLE_ID is null");
  }
  if (orderInfo?.SUB_TABLE_ID == null) {
    result = false;
    console.error('Error inputCheck Orders:', "SUB_TABLE_ID is null");
  }
  if (orderInfo?.AMONT == null) {
    result = false;
    console.error('Error inputCheck Orders:', "AMONT is null");
  }

  return result;

}

module.exports = router;
