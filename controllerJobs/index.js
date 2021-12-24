const {
  updateHourlyColdwalletCoins,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
} = require('./wallets');
const { updateDailyWalletBalance } = require('./walletBalance');
const { removeOutdatedNews } = require('./news');
const { emptyControllerLogs } = require('./logs');
const { updateAllInOne } = require('./allInOne');

module.exports = {
  updateHourlyColdwalletCoins,
  updateDailyWalletBalance,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
  removeOutdatedNews,
  emptyControllerLogs,
  updateAllInOne,
}