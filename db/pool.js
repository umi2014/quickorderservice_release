const mysql = require('mysql2');

// 接続プールの作成
const pool = mysql.createPool({
  host: 'localhost',
  user: 'ordersystem',
  password: '2wsxCDE#',
  database: 'quickorderdb',
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0
});

// プールをエクスポート
module.exports = pool;
