const {
  updateHourlyColdwalletCoins,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
} = require('./wallets');
const { updateDailyWalletBalance } = require('./walletBalance');

module.exports = {
  updateHourlyColdwalletCoins,
  updateDailyWalletBalance,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
}