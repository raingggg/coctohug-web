const { Key, Wallet, News } = require('../models');
const { logger } = require('../utils/logger');
const {
  getWalletAddress,
  get1HourOnlineWalletCoinsAmount,
  get1DayOnlineWalletCoinsAmount,
  get1WeekOnlineWalletCoinsAmount,
} = require('../utils/blockUtil');

const updateHourlyColdwalletCoins = async () => {
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
              message: `ColdWallet received ${coinsTotal} coins☘️ in last hour`,
            });
          }
        }
      } catch (ee) {
        logger.error('updateHourlyColdwalletCoins-onechain', ee);
      }
    }
  } catch (e) {
    logger.error('updateHourlyColdwalletCoins-job', e);
  }
};

const updateDailyColdwalletCoins = async () => {
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
        const { hostname, blockchain } = dataKeys[i];
        const actualWallet = dataWallets.find(dw => dw.hostname === hostname && dw.blockchain === blockchain);
        if (actualWallet && actualWallet.coldWallet) {
          const coinsTotal = await get1DayOnlineWalletCoinsAmount(blockchain, actualWallet.coldWallet);
          await News.create({
            hostname,
            blockchain,
            priority: 'low',
            service: 'COCTHUG_WEB',
            type: 'EVT_DAILY_ALL_IN_ONE',
            message: `ColdWallet received ${coinsTotal} coins☘️ in last day`,
          });
        }
      } catch (ee) {
        logger.error('updateDailyColdwalletCoins-onechain', ee);
      }
    }
  } catch (e) {
    logger.error('updateDailyColdwalletCoins-job', e);
  }
};

const updateWeeklyColdwalletCoins = async () => {
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
        const { hostname, blockchain } = dataKeys[i];
        const actualWallet = dataWallets.find(dw => dw.hostname === hostname && dw.blockchain === blockchain);
        if (actualWallet && actualWallet.coldWallet) {
          const coinsTotal = await get1WeekOnlineWalletCoinsAmount(blockchain, actualWallet.coldWallet);
          await News.create({
            hostname,
            blockchain,
            priority: 'low',
            service: 'COCTHUG_WEB',
            type: 'EVT_WEEKLY_ALL_IN_ONE',
            message: `ColdWallet received ${coinsTotal} coins☘️ in last week`,
          });
        }
      } catch (ee) {
        logger.error('updateWeeklyColdwalletCoins-onechain', ee);
      }
    }
  } catch (e) {
    logger.error('updateWeeklyColdwalletCoins-job', e);
  }
};


module.exports = {
  updateHourlyColdwalletCoins,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
};