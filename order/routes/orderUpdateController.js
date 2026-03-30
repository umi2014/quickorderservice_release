const express = require('express');
const router = express.Router();
const OrderService = require('../service/orderService.js'); // 共通化された接続プールをインポート
const orderService = new OrderService();

// オーダーステータスを更新する
router.post('/', async (req, res) => {
  const shopId = req.body.shopId;
  const rollId = req.body.rollId;
  const orderId = req.body.orderId;
  const orderStatus = req.body.toStatus;
  var inputCheckResult = inputCheck(shopId, rollId, orderId, orderStatus);
  if (!inputCheckResult) {
    return res.status(400).json({ error: 'orderInfo is required' });
  }

  try {
    var newOrderInfo = await orderService.updateOrderStatus(shopId, rollId, orderId, orderStatus);
    res.json(newOrderInfo);
  } catch (err) {
    console.error('Error fetching Orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch Orders' });
  }
});

function inputCheck(shopId, rollId, orderId, orderStatus) {
  var result = true;
  if (shopId == null) {
    result = false;
    console.error('Error inputCheck Orders:', "shopId is null");
  }
  if (rollId == null) {
    result = false;
    console.error('Error inputCheck Orders:', "rollId is null");
  }
  if (orderId == null) {
    result = false;
    console.error('Error inputCheck Orders:', "orderId is null");
  }
  if (orderStatus == null) {
    result = false;
    console.error('Error inputCheck Orders:', "orderStatus is null");
  }

  return result;

}

module.exports = router;
