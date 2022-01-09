const { WalletBalance } = require('../models');
const { logger } = require('../utils/logger');
const { getAllCoinsPrice, getCoinBalance } = require('../utils/blockUtil');
const { chainNameMap } = require('../utils/chainConfigs');
const {
  getRandomDurationByMinutes,
} = require('../utils/jsUtil');

const updateDailyWalletBalance = async () => {
  try {
    const prices = await getAllCoinsPrice();
    let topPrice = 0;
    Object.keys(prices).forEach(ch => {
      if (prices[ch] > topPrice) {
        topPrice = prices[ch];
      }
    });
    if (topPrice == 0) return;

    const data = await WalletBalance.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    for (let i = 0; i < data.length; i++) {
      setTimeout(async () => {
        try {
          const { blockchain, address } = data[i];
          if (!blockchain || !address) continute;

          const balance = await getCoinBalance(blockchain, address);
          const price = prices[chainNameMap[blockchain]] || 0;
          await WalletBalance.upsert({
            blockchain,
            address,
            balance,
            price,
            total_price: balance * price,
          });
        } catch (ex) {
          logger.error('updateDailyWalletBalance-one-coin', ex);
        }
      }, getRandomDurationByMinutes(120));
    }
  } catch (e) {
    logger.error('updateDailyWalletBalance-job', e);
  }
};

module.exports = {
  updateDailyWalletBalance
};