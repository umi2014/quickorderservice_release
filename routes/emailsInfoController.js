const express = require('express');
const router = express.Router();
const EmailInfoService = require('../service/emailInfoService.js'); // 共通化された接続プールをインポート
const emailInfoService = new EmailInfoService();

// メールを取り込みする
router.post('/01/', async (req, res) => {
  const corporationId = req.body.corporationId;
  if (!corporationId) {
    return res.status(400).json({ error: 'corporationId is required' });
  }

  try {
    var message = await emailInfoService.torikomiEmailByShopId(corporationId);
    res.json(message);
  } catch (err) {
    console.error('Error fetching mailSettingList:', err.message);
    res.status(500).json({ error: 'Failed to fetch mailSettingList' });
  }
});

// メール情報一覧を取得
router.post('/02/', async (req, res) => {
  const corporationId = req.body.corporationId;
  if (!corporationId) {
    return res.status(400).json({ error: 'corporationId is required' });
  }
  var joken = {};
  joken.shopId = corporationId;
  try {
    var mailInfoList = await emailInfoService.getEmailInfoList(joken);
    var data = {}
    data.mailInfoList = mailInfoList;
    res.json(data);
  } catch (err) {
    console.error('Error fetching mailInfoList:', err.message);
    res.status(500).json({ error: 'Failed to fetch mailInfoList' });
  }
});

// メール情報を更新
router.post('/03/', async (req, res) => {
  const emailInfo = req.body.emailInfo;
  if (!emailInfo.EMAIL_ID) {
    errorMessage += 'EMAIL_ID is required';
  }
  if (errorMessage?.length > 0) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    var result = await emailInfoService.updEmailInfo(emailInfo);
    var messageInfo = []
    messageInfo.push("更新成功しました。");
    var data = {};
    data.messageInfo = messageInfo;
    res.json(data);
  } catch (err) {
    console.error('Error update mailSetting:', err.message);
    res.status(500).json({ error: 'Failed to update mailSetting' });
  }
});

// メール情報を削除
router.post('/04/', async (req, res) => {
  const emailInfo = req.body.emailInfo;
  var errorMessage = "";
  if (!emailInfo || !emailInfo.EMAIL_ID) {
    errorMessage += 'EMAIL_ID is required';
  }
  if (errorMessage?.length > 0) {
    return res.status(400).json({ error: errorMessage });
  }

  try {
    var result = await emailInfoService.delEmailInfo(emailInfo);
    var messageInfo = []
    messageInfo.push("削除成功しました。");
    var data = {};
    data.messageInfo = messageInfo;
    res.json(data);
  } catch (err) {
    console.error('Error delete mailSetting:', err.message);
    res.status(500).json({ error: 'Failed to delete mailSetting' });
  }
});

// オーダー取込
router.post('/05/', async (req, res) => {
  const corporationId = req.body.corporationId;
  if (!corporationId) {
    return res.status(400).json({ error: 'corporationId is required' });
  }
  var joken = {};
  joken.shopId = corporationId
  joken.TORIKOMI_FLG = "0";
  joken.DELETE_FLG = "0";
  try {
    var mailInfoList = await emailInfoService.getEmailInfoList(joken);
    var orderEmailMappingSettings = await emailInfoService.getOrderEmailMappingSettings(corporationId);
    for (var i = 0; i < mailInfoList.length; i++) {
      var mainInfo = mailInfoList[i];
      await emailInfoService.analysitMailToOrder(mainInfo, orderEmailMappingSettings);
      mainInfo.TORIKOMI_FLG = "1";
      await emailInfoService.updEmailInfoStatus(mainInfo);
    }
    var data = {}
    data.mailInfoList = mailInfoList;
    res.json(data);
  } catch (err) {
    console.error('Error fetching mailInfoList:', err.message);
    res.status(500).json({ error: 'Failed to fetch mailInfoList' });
  }
});

// メール情報を取得
router.post('/06/', async (req, res) => {
  const emailId = req.body.emailId;
  console.debug('emailId:', emailId);
  var errorMessage = "";
  if (!emailId) {
    errorMessage += 'emailId is required';
  }
  if (errorMessage?.length > 0) {
    console.error('input check error:', errorMessage);
    return res.status(400).json({ error: errorMessage });
  }

  try {
    var mailInfo = await emailInfoService.getEmailInfo(emailId);
    var data = {}
    data.mailInfo = mailInfo;
    res.json(data);
  } catch (err) {
    console.error('Error get mailInfo:', err.message);
    res.status(500).json({ error: 'Failed to get mailInfo' });
  }
});

module.exports = router;
