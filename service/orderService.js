const OrderDao = require("../db/orderDao.js");
const ProductsLanguageDao = require("../db/productsLanguageDao.js");
const comEnum = require("../constants/com-enum.js");
const orderDao = new OrderDao();
const productsLanguageDao = new ProductsLanguageDao();

class OrderService {
  /**
   * 新しいオーダを作成する
   * @param {number} orderInfo オーダ情報
   * @returns 新規作成されたオーダ情報
   */
  async addNewOrder(orderInfo) {
    var sysDate = new Date();
    orderInfo.YEAR = sysDate.getFullYear();
    orderInfo.MONTH = sysDate.getMonth() + 1;
    orderInfo.DAY = sysDate.getDate();
    orderInfo.ORDERED_FLG = "1";
    orderInfo.PAYED_FLG = "0";
    orderInfo.CANCEL_FLG = "0";
    orderInfo.DELETE_FLG = "0";
    var newOrderInfo = await orderDao.insertOrder(orderInfo);
    orderInfo.ORDER_ID = newOrderInfo.ORDER_ID;
    if (orderInfo.orderDetailsInfo && orderInfo.orderDetailsInfo.length > 0) {
      for (var i = 0; i < orderInfo.orderDetailsInfo.length; i++) {
        var orderDetailsInfo = orderInfo.orderDetailsInfo[i];
        orderDetailsInfo.ORDER_ID = newOrderInfo.ORDER_ID;
        orderDetailsInfo.DELETE_FLG = "0";
        var newOrderDetailsInfo = await orderDao.insertOrderProduct(orderDetailsInfo);
        orderDetailsInfo.ORDER_PRODUCT_ID = newOrderDetailsInfo.ORDER_PRODUCT_ID;
      }
    }

    return orderInfo;
  }
  /**
   * オーダステータスを更新する
   * @param {number} shopId 店番号
   * @param {string} rollId ロールID
   * @param {number} orderId オーダーID
   * @param {string} orderStatus オーダーステータス
   * @returns 
   */
  async updateOrderStatus(shopId, rollId, orderId, orderStatus) {
    var oldOrderInfo = await orderDao.getOrderInfoById(orderId);
    var updateCount = 0;
    if (oldOrderInfo?.SHOP_ID == shopId && rollId) {
      var orderInfo = {};
      orderInfo.ORDER_ID = orderId;
      updateCount = await orderDao.updateOrderInfoById(orderInfo);
    }
    return updateCount;
  }

  /**
   * オーダ情報を取得する
   * @param {number} shopId 店ID
   * @param {number} rollId ロールID
   * @param {number} tableId テーブルID
   * @param {number} subTableId サブテーブルID
   * @returns オーダ情報リスト
   */
  async getOrderInfo(shopId, rollId, tableId, subTableId) {
    var orderInfors = {
      totalAmount: 0,
      PRICE_CURRENCY: "",
      orderList: []
    };
    var status = undefined;
    // お客様の場合
    if (!rollId) {
      status = " and PAYED_FLG<>'1'";
    } else if (comEnum.Roll_ITEM.KITCHEN.val == rollId) {
      // 厨房の場合
      status = " and ORDERED_FLG='1' and (PREPARE_FLG='0' or SERVING_FLG='0')";
    } else if (comEnum.Roll_ITEM.CASHIER.val == rollId) {
      // レンジの場合
      status = " and SERVING_FLG='1' and (PAYED_FLG='0' or CANCEL_FLG='0')";
    }
    var orderList = await orderDao.getOrderInfo(shopId, tableId, subTableId, status);
    if (orderList && orderList.length > 0) {
      for (var i = 0; i < orderList.length; i++) {
        var orderInfo = orderList[i];
        orderInfors.totalAmount += orderInfo.AMONT;
        orderInfors.PRICE_CURRENCY = orderInfo.PRICE_CURRENCY;
        var orderDetailList = await orderDao.getOrderDetailInfo(orderInfo.ORDER_ID);
        if (orderDetailList && orderDetailList.length > 0) {
          for (var j = 0; j < orderDetailList.length; j++) {
            var orderDetailInfo = orderDetailList[j];
            var productsLanguage = await productsLanguageDao.getLanguagesByProductId(orderDetailInfo.PRODUCT_ID);
            orderDetailInfo.language = productsLanguage;
          }
        }
        orderInfo.orderDetailList = orderDetailList;
      }
    }
    orderInfors.orderList = orderList;

    return orderInfors;
  }

  /**
   * オーダ情報を検索する
   * @param joken 条件
   * @returns オーダ情報リスト
   */
  async searchOrderInfo(joken) {
    var orderInfors = {
      totalAmount: 0,
      PRICE_CURRENCY: "",
      orderList: []
    };
    var orderList = await orderDao.getOrderInfo(joken);
    orderInfors.orderList = orderList;

    return orderInfors;
  }
}

module.exports = OrderService;
