const express = require('express');
const cors = require('cors');
const app = express();
const usersRouter = require('./system/routes/users.js');
const languageRouter = require('./system/routes/languageController.js');
const productsRouter = require('./product/routes/productController.js');
const productTypeRouter = require('./product/routes/productTypeController.js');
const orderRegestRouter = require('./order/routes/orderRegestController.js');
const orderInfoRouter = require('./order/routes/orderInfoController.js');
const orderSelectRouter = require('./order/routes/orderSelectController.js');
const orderUpdateRouter = require('./order/routes/orderUpdateController.js');
const emailSettingRouter = require('./emailAnalyst/routes/emailSettingController.js');
const emailsInfoRouter = require('./emailAnalyst/routes/emailsInfoController.js');
const inventoryRouter = require('./inventory/routes/inventoryController.js');
const subShopsRouter = require('./system/routes/subShopsController.js');
const paymentRouter = require('./system/routes/paymentController.js');

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
app.use('/ATH0101_02', productTypeRouter);
app.use('/ATH0102_01', orderRegestRouter);
app.use('/ATH0102_02', orderSelectRouter);
app.use('/ATH0102_05', paymentRouter);
app.use('/ATH0103_02', orderUpdateRouter);
app.use('/ENT0101', emailSettingRouter);
app.use('/ENT0201', emailsInfoRouter);
app.use('/ENT0212', orderInfoRouter);
app.use('/inventory', inventoryRouter);
app.use('/system/subShops', subShopsRouter);

// サーバーの起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://167.71.154.27:${PORT}`);
});
