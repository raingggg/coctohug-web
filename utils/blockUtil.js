const axios = require('axios');

const { logger } = require('./logger');
const {
  chainConfigs,
  getCoinRecordsUrl,
  getBalanceUrl,
} = require('./chainConfigs');
const {
  getLastHourDates,
  getLastDayDates,
  getLastWeekDates,
} = require('./jsUtil');

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

const getOnlineWalletRecords = async (blockchain, walletAdress, startDate, endDate) => {

};

const getOnlineWalletCoinsAmount = async (blockchain, walletAdress, startDate, endDate) => {
  let total = 0;
  const forkConfig = chainConfigs[blockchain];
  if (!forkConfig || !blockchain || !walletAdress || !startDate || !endDate) return total;

  // at most request API 50 times, this should support 50P+ cases
  let shouldStop = false;
  for (let p = 0; p < 50; p++) {
    if (shouldStop) break;

    try {
      const finalUrl = getCoinRecordsUrl(blockchain, walletAdress, p, 500);
      const apiRes = await axios.get(finalUrl, { timeout: TIMEOUT_1MINUTE }).catch(function (error) { logger.error(error); });
      const records = apiRes && apiRes.data && apiRes.data.content;
      if (records && records.length > 0) {
        records.forEach(rc => {
          const { amount, timestamp } = rc;
          const recordDate = new Date(timestamp * 1000); // unix * 1000 = js timestamp
          if ((recordDate >= startDate) && (recordDate < endDate)) {
            total += parseFloat(amount) / forkConfig.mojoDivider;
          } else if (recordDate < startDate) { // stop when find a pre-unrelevant record
            shouldStop = true;
          }
        });
      } else { // stop on last no records page
        shouldStop = true;
        break;
      }
    } catch (ex) {
      logger.error(ex);
    }
  }

  return total;
};

const get1HourOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
  const { startDate, endDate } = getLastHourDates();
  return await getOnlineWalletCoinsAmount(blockchain, walletAdress, startDate, endDate);
};

const get1DayOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
  const { startDate, endDate } = getLastDayDates();
  return await getOnlineWalletCoinsAmount(blockchain, walletAdress, startDate, endDate);
};

const get1WeekOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
  const { startDate, endDate } = getLastWeekDates();
  return await getOnlineWalletCoinsAmount(blockchain, walletAdress, startDate, endDate);
};

// const tt = async () => {
//   let amount = 0;
//   name = 'hddcoin';
//   address = 'hdd15u86w7e9c3nqayymqe3ayuhsxqvrdwh9ht6pf30epdhtczdu7kgqa7u4d9';
//   amount = await get1HourOnlineWalletCoinsAmount(name, address);
//   console.log(amount);
//   amount = await get1DayOnlineWalletCoinsAmount(name, address);
//   console.log(amount);
//   amount = await get1WeekOnlineWalletCoinsAmount(name, address);
//   console.log(amount);
// };
// tt();

module.exports = {
  getTotalBalance,
  getWalletAddress,
  getOnlineWalletRecords,
  getOnlineWalletCoinsAmount,
  get1HourOnlineWalletCoinsAmount,
  get1DayOnlineWalletCoinsAmount,
  get1WeekOnlineWalletCoinsAmount,
}