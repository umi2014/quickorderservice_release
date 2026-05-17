const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const comEnum = require('../../constants/com-enum.js');
const { SquareClient } = require('square');
const OrderService = require('../../order/service/orderService.js'); // オーダサービス
const orderService = new OrderService();
const ShopInfoService = require('../../system/service/shopInfoService.js'); // オーダサービス
const shopInfoService = new ShopInfoService();


router.post('/', async (req, res) => {
  const { shopId, orderId, sourceId, amount, currency } = req.body;

  try {
    var shopInfo = await shopInfoService.getShopInfoByShopId(shopId);

    const client = new SquareClient({
      token: shopInfo.SQUARE_ACCESS_TOKEN, // 建议从环境变量读取
      environment: shopInfo.ENVIRONMENT_URL, // 测试用
    });

    if (!shopId || !orderId || !sourceId || amount === undefined || !currency) {
      console.error("Missing required payment details:", req.body);
      throw new Error("Missing required payment details");
    }

    const idempotencyKey = crypto.randomUUID();

    const paymentResponse = await client.payments.create({
      sourceId: sourceId,
      idempotencyKey: idempotencyKey,
      amountMoney: {
        // The Square SDK requires BigInt for amounts. JPY has no decimal places so it's direct amount.
        amount: BigInt(Math.round(Number(amount))),
        currency: currency,
      },
      autocomplete: true,
      customerId: "sandbox-sq0idb--SrNwcZc1q1r1J5sSxwZjA",
      locationId: "L0045JHNB7XDT",
      referenceId: String(orderId),
      note: "test",
    });
    // オーダーステータス更新
    // 会計済み
    if (paymentResponse.payment.status == comEnum.EnumSquareOrderStatus.COMPLETED.val) {
      var orderStatus = comEnum.OrderStatus.PURCHASE_ORDER.val;
      var rollId = comEnum.Roll_ITEM.CASHIER.val;
      await orderService.updateOrderStatus(shopId, rollId, orderId, orderStatus);
      res.json({
        success: true,
        paymentId: paymentResponse.payment.id
      });
    } else {
      console.error("Payment status failed:", paymentResponse.payment.status);
      throw new Error("Payment status failed:" + paymentResponse.payment.status);
    }

  } catch (err) {
    // オーダーステータス更新
    // 会計済み
    var orderStatus = comEnum.OrderStatus.PURCHASE_ERROR.val;
    var rollId = comEnum.Roll_ITEM.CASHIER.val;
    await orderService.updateOrderStatus(shopId, rollId, orderId, orderStatus);
    console.error('Payment failed:', err);
    let errorMessage = 'Payment processing failed';
    if (err.errors && err.errors.length > 0) {
      errorMessage = err.errors[0].detail || err.errors[0].category;
    }
    res.status(400).json({ messageErr: [errorMessage] });
  }
});

module.exports = router;
