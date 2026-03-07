const mysql = require('mysql2/promise');
const { AsyncLocalStorage } = require('node:async_hooks');

// 1. 创建异步本地存储上下文
const storage = new AsyncLocalStorage();

// 2. 配置连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'quickorderdb',
  connectionLimit: 50
});

const db = {
  /**
   * 核心方法：获取当前执行器
   * 如果在事务上下文中，返回事务连接；否则返回连接池
   */
  get executor() {
    const conn = storage.getStore();
    return conn || pool;
  },

  /**
   * 模拟 Java 的 @Transactional
   * @param {Function} callback 业务逻辑异步函数
   */
  async transaction(callback) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      // 将连接存入异步上下文，并运行回调
      return await storage.run(conn, async () => {
        const result = await callback();
        await conn.commit();
        return result;
      });
      
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /**
   * 统一查询接口
   */
  async query(sql, params) {
    // 自动决定使用事务连接还是普通池
    return await this.executor.query(sql, params);
  }
};

module.exports = db;