const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // 共通化された接続プールをインポート

// ユーザー一覧を取得
router.get('/', (req, res) => {
    const shopId = req.params.shopId;
  pool.query('SELECT * FROM products where SHOP_ID=?', [shopId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ error: 'Failed to fetch users' });
      return;
    }
    res.json(results);
  });
});

// ユーザーをIDで取得
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  pool.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).json({ error: 'Failed to fetch user' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(results[0]);
    }
  });
});

module.exports = router;
