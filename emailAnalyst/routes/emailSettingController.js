const express = require('express');
const router = express.Router();
const EmailSettingService = require('../service/emailSettingService.js'); // 共通化された接続プールをインポート
const emailSettingService = new EmailSettingService();

// メーリ設定一覧を取得
router.post('/01/', async (req, res) => {
  const corporationId = req.body.corporationId;
  if (!corporationId) {
    return res.status(400).json({ error: 'corporationId is required' });
  }

  try {
    var mailSettingList = await emailSettingService.getEmailSettingsByShopId(corporationId);
    var data = {}
    data.mailSettingList = mailSettingList;
    res.json(data);
  } catch (err) {
    console.error('Error fetching mailSettingList:', err.message);
    res.status(500).json({ error: 'Failed to fetch mailSettingList' });
  }
});

function inputCheck(emailSetting) {

  var errorMessage = "";
  if (!emailSetting) {
    errorMessage += 'emailSetting is required\n';
  }
  if (!emailSetting.SHOP_ID) {
    errorMessage += 'SHOP_ID is required\n';
  }
  if (!emailSetting.EMAIL_ADDRESS) {
    errorMessage += 'EMAIL_ADDRESS is required\n';
  }
  if (!emailSetting.PASSWORD) {
    errorMessage += 'PASSWORD is required\n';
  }
  if (!emailSetting.RECEIVE_SERVER) {
    errorMessage += 'RECEIVE_SERVER is required\n';
  }
  if (!emailSetting.RECEIVE_PORT) {
    errorMessage += 'RECEIVE_PORT is required\n';
  }
  if (!emailSetting.SEND_SERVER) {
    errorMessage += 'SEND_SERVER is required\n';
  }
  if (!emailSetting.SEND_PORT) {
    errorMessage += 'SEND_PORT is required\n';
  }
  if (!emailSetting.ENCRYPTION_METHOD) {
    errorMessage += 'ENCRYPTION_METHOD is required\n';
  }
  return errorMessage;
}

// メーリ設定を挿入
router.post('/02/', async (req, res) => {
  const emailSetting = req.body.emailSetting;
  var errorMessage = inputCheck(emailSetting);
  if (errorMessage?.length > 0) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    var result = await emailSettingService.insEmailSetting(emailSetting);
    var messageInfo = []
    messageInfo.push("追加成功しました。");
    var data = {};
    data.messageInfo = messageInfo;
    res.json(data);
  } catch (err) {
    console.error('Error insert mailSetting:', err.message);
    res.status(500).json({ error: 'Failed to insert mailSetting' });
  }
});

// メーリ設定を更新
router.post('/03/', async (req, res) => {
  const emailSetting = req.body.emailSetting;
  var errorMessage = inputCheck(emailSetting);
  if (!emailSetting.EMAIL_SETTING_ID) {
    errorMessage += 'EMAIL_SETTING_ID is required';
  }
  if (errorMessage?.length > 0) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    var result = await emailSettingService.updEmailSetting(emailSetting);
    var messageInfo = []
    messageInfo.push("更新成功しました。");
    var data = {};
    data.messageInfo = messageInfo;
    console.debug('update mailSetting success:', data);
    res.json(data);
  } catch (err) {
    console.error('Error update mailSetting:', err.message);
    res.status(500).json({ error: 'Failed to update mailSetting' });
  }
});

// メーリ設定を削除
router.post('/04/', async (req, res) => {
  const emailSetting = req.body.emailSetting;
  var errorMessage = "";
  if (!emailSetting || !emailSetting.EMAIL_SETTING_ID) {
    errorMessage += 'EMAIL_SETTING_ID is required';
  }
  if (errorMessage?.length > 0) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    var result = await emailSettingService.delEmailSetting(emailSetting);
    var messageInfo = []
    messageInfo.push("削除成功しました。");
    var data = {};
    data.messageInfo = messageInfo;
    console.debug('delete mailSetting success:', data);
    res.json(data);
  } catch (err) {
    console.error('Error delete mailSetting:', err.message);
    res.status(500).json({ error: 'Failed to delete mailSetting' });
  }
});

module.exports = router;
