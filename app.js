const express = require('express');
const cors = require('cors');
const app = express();
const usersRouter = require('./routes/users.js');
const languageRouter = require('./routes/languageController.js');
const productsRouter = require('./routes/productController.js');
const orderRegestRouter = require('./routes/orderRegestController.js');
const orderInfoRouter = require('./routes/orderInfoController.js');
const orderSelectRouter = require('./routes/orderSelectController.js');
const orderUpdateRouter = require('./routes/orderUpdateController.js');
const emailSettingRouter = require('./routes/emailSettingController.js');
const emailsInfoRouter = require('./routes/emailsInfoController.js');
const PORT = 3060;
// CORS設定
const corsOptions = {
  origin: ['http://167.71.154.27', 'https://167.71.154.27'], // 許可するオリジン
  credentials: true,              // クッキーや認証情報を許可
};
app.use(cors(corsOptions));
// ミドルウェア
app.use(express.json());
// ルートの設定
app.use('/users', usersRouter);
app.use('/ATH0100_01', languageRouter);
app.use('/ATH0101_01', productsRouter);
app.use('/ATH0102_01', orderRegestRouter);
app.use('/ATH0102_02', orderSelectRouter);
app.use('/ATH0103_02', orderUpdateRouter);
app.use('/ENT0101', emailSettingRouter);
app.use('/ENT0201', emailsInfoRouter);
app.use('/ENT0212', orderInfoRouter);

// サーバーの起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://167.71.154.27:${PORT}`);
});
