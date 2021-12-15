const {
  updateHourlyColdwalletCoins,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
} = require('./wallets');
const { updateDailyWalletBalance } = require('./walletBalance');
const { removeOutdatedNews } = require('./news');

module.exports = {
  updateHourlyColdwalletCoins,
  updateDailyWalletBalance,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
  removeOutdatedNews,
}