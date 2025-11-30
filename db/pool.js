const mysql = require('mysql2');

// 接続プールの作成
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'orderdada',
  password: 'zaq1CDE#',
  database: 'quickorderdb',
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

// プールをエクスポート
module.exports = pool;
