// var i18n = require('i18n');
// const express = require('express');
// const router = express.Router();

// router.get('/', function (req, res, next) {
//   res.render('index', { title: req.__('Welcome to Express'), pageName: 'home' });
// });

// module.exports = router;

const blockchainsWeb = require('./blockchains');
const coldWalletWeb = require('./coldWallet');
const connectionsWeb = require('./connections');
const dailyReportWeb = require('./dailyReport');
const handsWeb = require('./hands');
const keysWeb = require('./keys');
const newsWeb = require('./news');
const plotsWeb = require('./plots');
const poolsWeb = require('./pools');
const receivedCoinsWeb = require('./receivedCoins');
const reviewWeb = require('./review');
const settingsWeb = require('./settings');
const walletsWeb = require('./wallets');
const weeklyReportWeb = require('./weeklyReport');

module.exports = {
  blockchainsWeb,
  coldWalletWeb,
  connectionsWeb,
  dailyReportWeb,
  handsWeb,
  keysWeb,
  newsWeb,
  plotsWeb,
  poolsWeb,
  receivedCoinsWeb,
  reviewWeb,
  settingsWeb,
  walletsWeb,
  weeklyReportWeb,
};