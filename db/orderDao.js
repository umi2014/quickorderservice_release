const pool = require('./pool'); // 共通化された接続プールをインポート

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
      var sql = "select a.*,b.TABLE_ICON,b.TABLE_NAME,b.TABLE_MESSAGE from orders a " +
        "left join tables b on b.SHOP_ID = a.SHOP_ID and b.TABLE_ID = a.TABLE_ID " +
        "where a.SHOP_ID=? ";
      var params = [joken.shopId];
      if (joken.siteName) {
        sql += " and b.TABLE_NAME like ?";
        params.push("%"+joken.siteName+"%");
      }
      if (joken.productName) {
        sql += " and a.PRODUCT_NAME like ?";
        params.push("%"+joken.productName+"%");
      }
      if (joken.orderStatus) {
        sql += " and a.ORDERED_FLG = ?";
        params.push(joken.orderStatus);
      }
      if (joken.cancelStatus) {
        sql += " and a.CANCEL_FLG = ?";
        params.push(joken.cancelStatus);
      }
      if (joken.dateFrom) {
        sql += " and a.ORDERED_TIME >= ?";
        params.push(joken.dateFrom);
      }
      if (joken.dateTo) {
        sql += " and a.ORDERED_TIME <= ?";
        params.push(joken.dateTo);
      }
      console.debug("SQL:" + sql);
      console.debug("PARAM:" + params);
      const results = await this.pool.promise().query(sql, params);
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
      const results = await this.pool.promise().query(sql, params);
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
      const results = await this.pool.promise().query(sql, params);
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
      var sql = "INSERT INTO orders(`SHOP_ID`, `TABLE_ID`, `SUB_TABLE_ID`, `EMAIL_ID`, `PRODUCT_NAME`, `PRICE`, `PRICE_CURRENCY`, `NUMBER`, `AMONT`, `POSTAGE`, `ADDTIONAl_PRICE`, `TAX`, `ORDER_KEY`, `YEAR`, `MONTH`, `DAY`, `ORDERED_FLG`, `ORDERED_TIME`, `PAYED_FLG`, `PAYED_TIME`, `CANCEL_FLG`, `CANCEL_TIME`, `DELETE_FLG`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?);";
      console.debug("SQL:" + sql);
      var param = [orderInfo.SHOP_ID, orderInfo.TABLE_ID, orderInfo.SUB_TABLE_ID, orderInfo.EMAIL_ID, orderInfo.PRODUCT_NAME, orderInfo.PRICE, orderInfo.PRICE_CURRENCY, orderInfo.NUMBER, orderInfo.AMONT, orderInfo.POSTAGE, orderInfo.ADDTIONAl_PRICE, orderInfo.TAX, orderInfo.ORDER_KEY, orderInfo.YEAR, orderInfo.MONTH, orderInfo.DAY, orderInfo.ORDERED_FLG, orderInfo.PAYED_FLG, null, orderInfo.CANCEL_FLG, null, orderInfo.DELETE_FLG];
      console.debug("PARAM:" + param);
      await this.pool.promise().query(sql, param);
      var sqlLastIndex = "SELECT LAST_INSERT_ID();";
      const results = await this.pool.promise().query(sqlLastIndex);
      if (results && results.length > 0) {
        console.debug("result:" + results[0][0]["LAST_INSERT_ID()"]);
        orderInfo.ORDER_ID = results[0][0]["LAST_INSERT_ID()"];
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
      await this.pool.promise().query(sql, params);
      var sqlLastIndex = "SELECT LAST_INSERT_ID();";
      const results = await this.pool.promise().query(sqlLastIndex);
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
        const results = await this.pool.promise().query(sql, params);
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
