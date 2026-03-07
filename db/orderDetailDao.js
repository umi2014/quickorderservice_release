const pool = require('./pool'); // 共通化された接続プールをインポート

class OrderDetailDao {
  constructor() {
    this.pool = pool; // クラス内で接続プールを参照
  }

  /**
   * 1. 批量插入订单明细 (解析邮件时使用)
   * @param {Array} details 明细数组 [{PRODUCT_NAME, PRICE, NUMBER}, ...]
   * @param {number} orderId 关联的主订单ID
   */
  async insertOrderDetails(details, orderId) {
    if (!details || details.length === 0) return 0;

    // 准备批量插入的 SQL
    const sql = `
      INSERT INTO orders_products 
      (ORDER_ID, PRODUCT_NAME, PRICE, NUMBER, AMONT) 
      VALUES ?
    `;
    console.debug("SQL:" + sql);
    // 格式化数据为 [[val1, val2...], [val1, val2...]]
    const values = details.map(d => [
      orderId,
      d.PRODUCT_NAME,
      d.PRICE || 0,
      d.NUMBER || 0,
      (d.PRICE || 0) * (d.NUMBER || 0) // 自动计算小计
    ]);
    console.debug("values:" + values);
    try {
      const [result] = await this.pool.query(sql, [values]);
      return result.affectedRows;
    } catch (err) {
      console.error("Error in insertOrderDetails:", err);
      throw err;
    }
  }

  /**
   * 2. 根据主订单 ID 取得所有明细
   * @param {number} orderId
   */
  async getDetailsByOrderId(orderId) {
    const sql = `SELECT * FROM order_details WHERE ORDER_ID = ?`;
    try {
      const [rows] = await this.pool.query(sql, [orderId]);
      return rows;
    } catch (err) {
      console.error("Error in getDetailsByOrderId:", err);
      throw err;
    }
  }

  /**
   * 3. 修改单条明细信息
   * @param {Object} detail {DETAIL_ID, PRODUCT_NAME, PRICE, NUMBER}
   */
  async updateOrderDetail(detail) {
    const sql = `
      UPDATE order_details 
      SET PRODUCT_NAME = ?, PRICE = ?, NUMBER = ?, SUB_TOTAL = ? 
      WHERE DETAIL_ID = ?
    `;
    const subTotal = (detail.PRICE || 0) * (detail.NUMBER || 0);
    const params = [detail.PRODUCT_NAME, detail.PRICE, detail.NUMBER, subTotal, detail.DETAIL_ID];

    try {
      const [result] = await this.pool.query(sql, params);
      return result.affectedRows;
    } catch (err) {
      console.error("Error in updateOrderDetail:", err);
      throw err;
    }
  }

  /**
   * 4. 删除明细
   * @param {number} detailId 明细唯一ID
   */
  async deleteOrderDetail(detailId) {
    const sql = `DELETE FROM order_details WHERE DETAIL_ID = ?`;
    try {
      const [result] = await this.pool.query(sql, [detailId]);
      return result.affectedRows;
    } catch (err) {
      console.error("Error in deleteOrderDetail:", err);
      throw err;
    }
  }

  /**
   * 5. 根据主订单 ID 删除所有明细 (通常在删除整个订单时调用)
   * @param {number} orderId
   */
  async deleteDetailsByOrderId(orderId) {
    const sql = `DELETE FROM order_details WHERE ORDER_ID = ?`;
    try {
      const [result] = await this.pool.query(sql, [orderId]);
      return result.affectedRows;
    } catch (err) {
      console.error("Error in deleteDetailsByOrderId:", err);
      throw err;
    }
  }
}

module.exports = OrderDetailDao;