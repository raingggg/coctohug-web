const axios = require('axios');
const cheerio = require('cheerio');

const { logger } = require('./logger');
const chainConfigs = require('./chainConfigs');

const TIMEOUT_1MINUTE = 60 * 1000;
const TIME_1HOUR = 60 * 60 * 1000;

const REG_BALANCE = /-Total\sBalance:\s+((?:\d*\.\d+)|(?:\d+\.?))/g;
const REG_WALLET_ADDR = /First wallet address: (\w*)/;

const getTotalBalance = (str) => {
  let sum = 0;
  const reg = new RegExp(REG_BALANCE);
  while (null != (z = reg.exec(str))) {
    const ob = parseFloat(z[1]);
    if (ob > 0) sum += ob;
  }

  return sum;
}

const getWalletAddress = (str) => {
  const match = REG_WALLET_ADDR.exec(str);
  if (match && match[1]) return match[1].trim();
}

const getOnlineWalletRecords = async (blockchain, walletAdress, duration) => {
  if (!blockchain || !walletAdress) return [];

  const prefix = chainConfigs[blockchain];
  if (!prefix) return [];

  try {
    const now = new Date().getTime();
    const finalUrl = `${prefix.exp}${walletAdress}`;
    const apiRes = await axios.get(finalUrl, { timeout: TIMEOUT_1MINUTE }).catch(function (error) { logger.error(error); });
    if (apiRes && apiRes.data) {
      const records = [];
      const $ = cheerio.load(apiRes.data);
      const trs = $('.card-body div[data-fetch-key="3"] table tbody tr');
      for (let i = 0; i < trs.length; i++) {
        const oneRecord = [];
        $(trs[i]).find('td').each(function () {
          oneRecord.push($(this).text().trim());
        });
        records.push(oneRecord);
      }

      return records.filter(rec => (now - new Date(rec[0]).getTime() <= duration)).map(rec => rec[5]);
    }
  } catch (e) {
    logger.error(e);
  }

  return [];
};

const getOnlineWalletCoinsAmount = async (blockchain, walletAdress, duration) => {
  let total = 0;

  try {
    const coins = await getOnlineWalletRecords(blockchain, walletAdress, duration);
    coins.forEach(cn => {
      total += parseFloat(cn);
    });
  } catch (e) {
    logger.error(e);
  }

  return total;
};

const get1HourOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
  return await getOnlineWalletCoinsAmount(blockchain, walletAdress, TIME_1HOUR);
};

// not accurate since online only return 50 records
// const get1DayOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
//   return await getOnlineWalletCoinsAmount(blockchain, walletAdress, TIME_1HOUR * 24);
// };

// not accurate since online only return 50 records
// const get1WeekOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
//   return await getOnlineWalletCoinsAmount(blockchain, walletAdress, TIME_1HOUR * 24 * 7);
// };

// get1HourOnlineWalletCoinsAmount('covid', 'cov18e2k68pxw66f2daukkkp4tguhfpv79vc0gtqrx7lvvckgdnvh0tqvjdzge');
// get1DayOnlineWalletCoinsAmount('covid', 'cov18e2k68pxw66f2daukkkp4tguhfpv79vc0gtqrx7lvvckgdnvh0tqvjdzge');
// get1WeekOnlineWalletCoinsAmount('covid', 'cov18e2k68pxw66f2daukkkp4tguhfpv79vc0gtqrx7lvvckgdnvh0tqvjdzge');

module.exports = {
  getTotalBalance,
  getWalletAddress,
  getOnlineWalletRecords,
  getOnlineWalletCoinsAmount,
  get1HourOnlineWalletCoinsAmount,
}