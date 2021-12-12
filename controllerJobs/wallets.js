const { Key, Wallet, News } = require('../models');
const { logger } = require('../utils/logger');
const { getWalletAddress, get1HourOnlineWalletCoinsAmount } = require('../utils/blockUtil');

const updateColdwalletCoins = async () => {
  try {
    const dataKeys = await Key.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    const dataWallets = await Wallet.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    for (let i = 0; i < dataKeys.length; i++) {
      try {
        const { hostname, blockchain, details } = dataKeys[i];
        const firstWalletAdress = getWalletAddress(details);
        const actualWallet = dataWallets.find(dw => dw.hostname === hostname && dw.blockchain === blockchain);
        if (firstWalletAdress && actualWallet && actualWallet.coldWallet && firstWalletAdress !== actualWallet.coldWallet) {
          const coinsTotal = await get1HourOnlineWalletCoinsAmount(blockchain, actualWallet.coldWallet);
          if (coinsTotal > 0) {
            await News.create({
              hostname,
              blockchain,
              priority: 'low',
              service: 'COCTHUG_WEB',
              type: 'EVT_INTIME_RECEIVE_COIN',
              message: `ColdWallet received ${coinsTotal} coins☘️`,
            });
          }
        }
      } catch (ee) {
        logger.error('updateColdwalletCoins-onechain', ee);
      }
    }
  } catch (e) {
    logger.error('updateColdwalletCoins-job', e);
  }
};

module.exports = {
  updateColdwalletCoins
};