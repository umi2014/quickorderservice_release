const express = require('express');
const router = express.Router();
const OrderService = require('../service/orderService.js'); // 共通化された接続プールをインポート
const orderService = new OrderService();

// オーダー一覧を取得
router.post('/', async (req, res) => {
  const shopId = req.body.shopId;
  const rollId = req.body.rollId;
  const tableId = req.body.tableId;
  const subTableId = req.body.subTableId;
  var inputCheckResult = inputCheck(shopId, rollId, tableId, subTableId);
  if (!inputCheckResult) {
    return res.status(400).json({ error: 'shopId, tableId, subTableId is required' });
  }

  try {
    var orderInfors = await orderService.getOrderInfo(shopId, rollId, tableId, subTableId);
    res.json(orderInfors);
  } catch (err) {
    console.error('Error fetching Orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch Orders' });
  }
});

function inputCheck(shopId, rollId, tableId, subTableId) {
  var result = true;
  if (shopId == null) {
    result = false;
    console.error('Error inputCheck Orders:', "SHOP_ID is null");
  }
  if (!rollId) {
    if (tableId == null) {
      result = false;
      console.error('Error inputCheck Orders:', "TABLE_ID is null");
    }
    if (subTableId == null) {
      result = false;
      console.error('Error inputCheck Orders:', "SUB_TABLE_ID is null");
    }
  }

  return result;

}

module.exports = router;
