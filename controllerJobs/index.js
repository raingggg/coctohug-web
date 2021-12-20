const {
  updateHourlyColdwalletCoins,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
} = require('./wallets');
const { updateDailyWalletBalance } = require('./walletBalance');
const { removeOutdatedNews } = require('./news');
const { emptyControllerLogs } = require('./logs');

module.exports = {
  updateHourlyColdwalletCoins,
  updateDailyWalletBalance,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
  removeOutdatedNews,
  emptyControllerLogs,
}