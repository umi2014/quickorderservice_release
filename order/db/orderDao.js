const pool = require('../../db/pool'); // 共通化された接続プールをインポート

class OrdersDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 指定した検索条件のオーダ情報を取得
   * @param joken 検索条件
   * @returns {Promise<Array>} オーダデータの配列
   */
  async getOrderInfo(joken) {
    try {
      // クエリの実行
      var sql = "select a.ORDER_ID,a.SHOP_ID,a.TABLE_ID,a.SUB_TABLE_ID,a.EMAIL_ID,a.PRICE_CURRENCY,a.ORDER_NAME,a.PRICE,a.NUMBER,a.AMONT,a.POSTAGE,a.ADDTIONAl_PRICE,a.TAX,a.ORDER_KEY,a.EVENT_DATE,a.PREPARE_TIME,a.CUSTOMER_NAME,a.COORDINATOR_NAME,a.PHONE_NUMBER,a.EMAIL,a.ADDRESS,a.MESSAGE,a.PAYMENT_TIPE,a.RECEIPT_DISCLAIMER,a.RECEIPT_ADDRESSEE,CAST(a.MEMO AS CHAR(10000) CHARACTER SET utf8) as MEMO,a.ORDER_UPDATE_FLG,a.ORDER_UPDATE_TIME,CAST(a.ORDER_UPDATE_MEMO AS CHAR(10000) CHARACTER SET utf8) as ORDER_UPDATE_MEMO,a.YEAR,a.MONTH,a.DAY,a.ORDERED_FLG,a.ORDERED_TIME,a.PREPARED_FLG,a.PREPARED_TIME,a.SERVING_FLG,a.SERVING_TIME,a.PAYED_FLG,a.PAYED_TIME,a.CANCEL_FLG,a.CANCEL_TIME,a.DELETE_FLG,b.TABLE_ICON,b.TABLE_NAME,b.TABLE_MESSAGE from orders a " +
        "left join tables b on b.SHOP_ID = a.SHOP_ID and b.TABLE_ID = a.TABLE_ID " +
        "where a.SHOP_ID=? ";
      var params = [joken.shopId];
      if (joken.lastOrderId) {
        sql += " and a.ORDER_ID < ? ";
        params.push(joken.lastOrderId);
      }
      if (joken.customerName) {
        sql += " and a.CUSTOMER_NAME like ? ";
        params.push("%" + joken.customerName + "%");
      }
      if (joken.coordinatorName) {
        sql += " and a.COORDINATOR_NAME like ? ";
        params.push("%" + joken.coordinatorName + "%");
      }
      if (joken.orderName) {
        sql += " and a.ORDER_NAME like ? ";
        params.push("%" + joken.orderName + "%");
      }
      if (joken.orderStatus) {
        sql += " and a.ORDERED_FLG = ? ";
        params.push(joken.orderStatus);
      }
      if (joken.orderKey) {
        sql += " and a.ORDER_KEY = ? ";
        params.push(joken.orderKey);
      }
      if (joken.updateStatus) {
        sql += " and a.ORDER_UPDATE_FLG = ? ";
        params.push(joken.updateStatus);
      }
      if (joken.cancelStatus) {
        sql += " and a.CANCEL_FLG = ? ";
        params.push(joken.cancelStatus);
      }
      if (joken.eventDateFrom) {
        sql += " and STR_TO_DATE(a.EVENT_DATE,'%Y年%m月%d日') >= ? ";
        params.push(joken.eventDateFrom);
      }
      if (joken.eventDateTo) {
        sql += " and STR_TO_DATE(a.EVENT_DATE,'%Y年%m月%d日') <= ? ";
        params.push(joken.eventDateTo);
      }
      if (joken.dateFrom) {
        sql += " and a.ORDERED_TIME >= ? ";
        params.push(joken.dateFrom);
      }
      if (joken.dateTo) {
        sql += " and a.ORDERED_TIME <= ? ";
        params.push(joken.dateTo);
      }
      if (joken.status) {
        sql += joken.status;
      }
      sql += "order by a.SHOP_ID asc,a.ORDER_ID desc "
      if (joken.getAllFlg) {
      } else if (joken.offset) {
        sql += "LIMIT ?,20; "
        if (joken.offset > 0) {
          params.push(joken.offset);
        } else {
          params.push(0);
        }
      } else {
        sql += "LIMIT 20; "
      }
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + params);
      const results = await this.pool.query(sql, params);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch orders by order ID');
    }
  }

  /**
   * 指定した検索条件のオーダ件数を取得
   * @param joken 検索条件
   * @returns {Promise<number>} オーダ件数
   */
  async getOrderInfoCount(joken) {
    try {
      var sql = "select count(*) as totalCount from orders a " +
        "where a.SHOP_ID = ? ";
      var params = [joken.shopId];
      if (joken.customerName) {
        sql += " and a.CUSTOMER_NAME like ? ";
        params.push("%" + joken.customerName + "%");
      }
      if (joken.coordinatorName) {
        sql += " and a.COORDINATOR_NAME like ? ";
        params.push("%" + joken.coordinatorName + "%");
      }
      if (joken.orderName) {
        sql += " and a.ORDER_NAME like ? ";
        params.push("%" + joken.orderName + "%");
      }
      if (joken.orderStatus) {
        sql += " and a.ORDERED_FLG = ? ";
        params.push(joken.orderStatus);
      }
      if (joken.orderKey) {
        sql += " and a.ORDER_KEY = ? ";
        params.push(joken.orderKey);
      }
      if (joken.updateStatus) {
        sql += " and a.ORDER_UPDATE_FLG = ? ";
        params.push(joken.updateStatus);
      }
      if (joken.cancelStatus) {
        sql += " and a.CANCEL_FLG = ? ";
        params.push(joken.cancelStatus);
      }
      if (joken.eventDateFrom) {
        sql += " and STR_TO_DATE(a.EVENT_DATE,'%Y年%m月%d日') >= ? ";
        params.push(joken.eventDateFrom);
      }
      if (joken.eventDateTo) {
        sql += " and STR_TO_DATE(a.EVENT_DATE,'%Y年%m月%d日') <= ? ";
        params.push(joken.eventDateTo);
      }
      if (joken.dateFrom) {
        sql += " and a.ORDERED_TIME >= ? ";
        params.push(joken.dateFrom);
      }
      if (joken.dateTo) {
        sql += " and a.ORDERED_TIME <= ? ";
        params.push(joken.dateTo);
      }
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + params);
      const results = await this.pool.query(sql, params);
      if (results && results.length > 0) {
        return results[0][0].totalCount;
      } else {
        return 0;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch orders count');
    }
  }

  /**
   * 指定したオーダーIDのオーダ情報を取得
   * @param {number} orderId オーダーID
   * @returns {orderInfo} オーダ情報
   */
  async getOrderInfoById(orderId) {
    try {
      // クエリの実行
      var sql = "select a.* from orders a "
        + "where a.ORDER_ID = ?";
      var params = [orderId];
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + params);
      const results = await this.pool.query(sql, params);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch orders by order ID');
    }
  }

  /**
   * 指定したオーダーIDのオーダ詳細情報を取得
   * @param {number} orderId オーダーID
   * @returns {Promise<Array>} オーダ詳細データの配列
   */
  async getOrderDetailInfo(orderId) {
    try {
      // クエリの実行
      var sql = "select a.*,b.PRODUCT_IMG from orders_products a "
        + "inner join products b on a.PRODUCT_ID = b.PRODUCT_ID "
        + "where a.ORDER_ID in (?)";
      var params = [orderId];
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + params);
      const results = await this.pool.query(sql, params);
      if (results && results.length > 0) {
        console.debug("result:" + results[0].length);
        return results[0];
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch orders by order ID');
    }
  }

  /**
   * オーダ情報を挿入する
   * @param orderInfo オーダ情報
   * @returns 
   */
  async insertOrder(orderInfo) {
    try {
      // クエリの実行
      var sql = "INSERT INTO orders(`SHOP_ID` , `TABLE_ID` , `SUB_TABLE_ID` , `EMAIL_ID` , `PRICE_CURRENCY` , `ORDER_NAME` , `PRICE` , `NUMBER` , `AMONT` , `POSTAGE` , `ADDTIONAl_PRICE` , `TAX` , `ORDER_KEY` , `EVENT_DATE` , `PREPARE_TIME` , `CUSTOMER_NAME` , `COORDINATOR_NAME` , `PHONE_NUMBER` , `EMAIL` , `ADDRESS` , `MESSAGE` , `PAYMENT_TIPE` , `RECEIPT_DISCLAIMER` , `RECEIPT_ADDRESSEE` , `MEMO` , `ORDER_UPDATE_FLG` , `ORDER_UPDATE_TIME` , `ORDER_UPDATE_MEMO` , `YEAR` , `MONTH` , `DAY` , `ORDERED_FLG` , `ORDERED_TIME` , `PREPARED_FLG` , `PREPARED_TIME` , `SERVING_FLG` , `SERVING_TIME` , `PAYED_FLG` , `PAYED_TIME` , `CANCEL_FLG` , `CANCEL_TIME` , `DELETE_FLG`) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , CURRENT_TIMESTAMP , ? , ? , ? , ? , ? , ? , ? , ? , ?);";
      console.debug("SQL:" + sql);
      var param = [orderInfo.SHOP_ID, orderInfo.TABLE_ID, orderInfo.SUB_TABLE_ID, orderInfo.EMAIL_ID, orderInfo.PRICE_CURRENCY, orderInfo.ORDER_NAME, orderInfo.PRICE, orderInfo.NUMBER, orderInfo.AMONT, orderInfo.POSTAGE, orderInfo.ADDTIONAl_PRICE, orderInfo.TAX, orderInfo.ORDER_KEY, orderInfo.EVENT_DATE, orderInfo.PREPARE_TIME, orderInfo.CUSTOMER_NAME, orderInfo.COORDINATOR_NAME, orderInfo.PHONE_NUMBER, orderInfo.EMAIL, orderInfo.ADDRESS, orderInfo.MESSAGE, orderInfo.PAYMENT_TIPE, orderInfo.RECEIPT_DISCLAIMER, orderInfo.RECEIPT_ADDRESSEE, orderInfo.MEMO, orderInfo.ORDER_UPDATE_FLG, orderInfo.ORDER_UPDATE_TIME, orderInfo.ORDER_UPDATE_MEMO, orderInfo.YEAR, orderInfo.MONTH, orderInfo.DAY, orderInfo.ORDERED_FLG, orderInfo.PREPARED_FLG, orderInfo.PREPARED_TIME, orderInfo.SERVING_FLG, orderInfo.SERVING_TIME, orderInfo.PAYED_FLG, orderInfo.PAYED_TIME, orderInfo.CANCEL_FLG, orderInfo.CANCEL_TIME, 0];
      console.debug("PARAM:" + param);
      const [result] = await this.pool.query(sql, param);
      console.debug("Order Inserted, ID:", result.insertId);
      // var sqlLastIndex = "SELECT LAST_INSERT_ID();";
      // const results = await this.pool.query(sqlLastIndex);
      if (result.insertId > 0) {
        // console.debug("result:" + results[0][0]["LAST_INSERT_ID()"]);
        orderInfo.ORDER_ID = result.insertId;
        return orderInfo;
      } else {
        orderInfo.ORDER_ID = 0;
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to insert orders');
    }
  }

  /**
   * オーダ情報を挿入する
   * @param orderDetailInfo オーダ詳細情報
   * @returns 
   */
  async insertOrderProduct(orderDetailInfo) {
    try {
      // クエリの実行
      var sql = "INSERT INTO orders_products(`ORDER_ID`, `PRODUCT_ID`, `NUMBER`, `PRICE`, `PRICE_CURRENCY`, `AMONT`, `DELETE_FLG`) VALUES (?, ?, ?, ?, ?, ?, ?);";
      console.debug("SQL:" + sql);
      var params = [orderDetailInfo.ORDER_ID, orderDetailInfo.PRODUCT_ID, orderDetailInfo.NUMBER, orderDetailInfo.PRICE, orderDetailInfo.PRICE_CURRENCY, orderDetailInfo.AMONT, orderDetailInfo.DELETE_FLG];
      console.debug("PARAM:" + params);
      await this.pool.query(sql, params);
      var sqlLastIndex = "SELECT LAST_INSERT_ID();";
      const results = await this.pool.query(sqlLastIndex);
      if (results && results.length > 0) {
        console.debug("result:" + results[0][0]["LAST_INSERT_ID()"]);
        orderDetailInfo.ORDER_PRODUCT_ID = results[0][0]["LAST_INSERT_ID()"];
        return orderDetailInfo;
      } else {
        console.debug("result:0");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to insert orders_products');
    }
  }

  /**
   * 指定したオーダーIDのオーダ情報を更新する
   * @param {orderInfo} orderInfo オーダー情報
   * @returns {count} 更新件数
   */
  async updateOrderInfoById(orderInfo) {
    try {
      // クエリの実行
      var sql = "update orders"
        + " set";
      var params = [];
      var updateFlg = false;
      if (orderInfo?.PREPARE_FLG) {
        sql += " PREPARE_FLG = ?, PREPARE_TIME=CURRENT_TIMESTAMP";
        params.push(orderInfo.PREPARE_FLG);
        updateFlg = true;
      }
      if (orderInfo?.SERVING_FLG) {
        sql += " SERVING_FLG = ?, SERVING_TIME=CURRENT_TIMESTAMP";
        params.push(orderInfo.SERVING_FLG);
        updateFlg = true;
      }
      if (orderInfo?.PAYED_FLG) {
        sql += " PAYED_FLG = ?, PAYED_TIME=CURRENT_TIMESTAMP";
        params.push(orderInfo.PAYED_FLG);
        updateFlg = true;
      }
      if (orderInfo?.CANCEL_FLG) {
        sql += " CANCEL_FLG = ?, CANCEL_TIME=CURRENT_TIMESTAMP";
        params.push(orderInfo.CANCEL_FLG);
        updateFlg = true;
      }
      if (updateFlg) {
        sql += " where ORDER_ID = ?";
        params.push(orderId);
        console.debug("SQL:" + sql);
        console.debug("PARAM:" + params);
        const results = await this.pool.query(sql, params);
        if (results && results.length > 0) {
          console.debug("result:" + results[0].length);
          return results[0];
        } else {
          console.debug("result:0");
          return;
        }
      } else {
        console.debug("no columns to update.");
        return;
      }
    } catch (err) {
      console.error('Error executing query:', err.stack);
      throw new Error('Failed to fetch orders by order ID');
    }
  }
}

module.exports = OrdersDao;
