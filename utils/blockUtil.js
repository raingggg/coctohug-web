const axios = require('axios');
const cheerio = require('cheerio');

const { logger } = require('./logger');
const {
  chainConfigs,
  getCoinRecordsUrl,
  getBalanceUrl,
  getPriceUrl,
} = require('./chainConfigs');
const {
  TIMEOUT_1MINUTE,
  TIMEOUT_4HOUR,
  TIMEOUT_1Day,
  getLastHourDates,
  getLastDayDates,
  getLastWeekDates,
  toNumber,
} = require('./jsUtil');


const REG_BALANCE = /-Total\sBalance:\s+((?:\d*\.?\d+e-\d*)|(?:\d*\.\d+)|(?:\d+\.?))\s+(\w+)/g;
const REG_POOL_WALLET = /Wallet ID (\d+) type POOLING_WALLET.*\n.*Total Balance: ((?:\d*\.?\d+e-\d*)|(?:\d*\.\d+)|(?:\d+\.?)) xch/gm;
const REG_WALLET_ADDR = /First wallet address: (\w*)/;
const REG_WALLET_HEIGHT = /Wallet height:\s+(\d+)/;
const REG_WALLET_STATUS = /Sync status:\s+(.*)/;
const REG_CHAIN_INFO = /Time:\s+(.{1,60})Height:\s+(.{1,30})/;
const REG_ETW = /(\d+)\s+(\w+)(\s+and\s+)?(\d+)?\s?(\w+)?/;

const getTotalBalance = (str) => {
  let sum = 0;
  const reg = new RegExp(REG_BALANCE);
  while (null != (z = reg.exec(str))) {
    const ob = parseFloat(z[1]);
    if (ob > 0) sum += ob;
  }

  return sum;
}

const getChiaPoolWalletId = (str) => {
  let poolWalletId = 0;

  const reg = new RegExp(REG_POOL_WALLET);
  while (null != (z = reg.exec(str))) {
    if (parseFloat(z[2]) > 0) {
      poolWalletId = z[1];
      break;
    }
  }

  return poolWalletId;
}

const getWalletAddress = (str) => {
  const match = REG_WALLET_ADDR.exec(str);
  if (match && match[1]) return match[1].trim();
}

const getOnlineWalletRecords = async (blockchain, walletAdress, startDate, endDate) => {

};

const getOnlineWalletCoinsAmount = async (blockchain, walletAdress, startDate, endDate, computeLastBlockTime) => {
  let total = 0;
  const forkConfig = chainConfigs[blockchain];
  if (!forkConfig || !blockchain || !walletAdress || !startDate || !endDate) return total;

  // at most request API 50 times, this should support 50P+ cases
  let shouldStop = false;
  let blockCountToday = 0;
  let noBlockInDays = 1000;
  const lastDay = getLastDayDates();
  const todayStartTime = lastDay.endDate;
  const nowTime = new Date().getTime();
  let last_block_time = new Date('1970-01-01').getTime();
  for (let p = 0; p < 50; p++) {
    if (shouldStop) break;

    try {
      const finalUrl = getCoinRecordsUrl(blockchain, walletAdress, p, 500);
      const apiRes = await axios.get(finalUrl, { timeout: TIMEOUT_1MINUTE }).catch(function (error) {
        logger.error('getOnlineWalletCoinsAmount-api', finalUrl);
      });
      const records = apiRes && apiRes.data && apiRes.data.content;
      if (records && records.length > 0) {
        records.forEach(rc => {
          const { amount, timestamp } = rc;
          const jsTimestamp = timestamp * 1000;
          if (computeLastBlockTime && last_block_time < jsTimestamp) {
            last_block_time = jsTimestamp;
          }

          const recordDate = new Date(jsTimestamp); // unix * 1000 = js timestamp
          if ((recordDate >= startDate) && (recordDate < endDate)) {
            total += parseFloat(amount) / forkConfig.mojoDivider;
          } else if (recordDate < startDate) { // stop when find a pre-unrelevant record
            shouldStop = true;
          }

          if (computeLastBlockTime && recordDate >= todayStartTime) {
            blockCountToday += parseFloat(amount) / forkConfig.mojoDivider;
          }
        });
      } else { // stop on last no records page
        shouldStop = true;
        break;
      }
    } catch (ex) {
      logger.error('getOnlineWalletCoinsAmount', ex);
    }
  }

  if (computeLastBlockTime) {
    noBlockInDays = parseFloat(((nowTime - last_block_time) / TIMEOUT_1Day).toFixed(2));
    blockCountToday = parseFloat(blockCountToday.toFixed(8));
  }

  return { total, last_block_time, noBlockInDays, blockCountToday };
};

const get1HourOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
  const { startDate, endDate } = getLastHourDates();
  const { total, last_block_time, noBlockInDays, blockCountToday } = await getOnlineWalletCoinsAmount(blockchain, walletAdress, startDate, endDate, true);
  return { total, last_block_time, noBlockInDays, blockCountToday };
};

const get1DayOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
  const { startDate, endDate } = getLastDayDates();
  const { total } = await getOnlineWalletCoinsAmount(blockchain, walletAdress, startDate, endDate, false);
  return total;
};

const get1WeekOnlineWalletCoinsAmount = async (blockchain, walletAdress) => {
  const { startDate, endDate } = getLastWeekDates();
  const { total } = await getOnlineWalletCoinsAmount(blockchain, walletAdress, startDate, endDate, false);
  return total;
};

const getAllTheBlocksPrice = async () => {
  const coinsPrice = {};

  try {
    const finalUrl = 'https://alltheblocks.net/';
    const apiRes = await axios.get(finalUrl, { timeout: TIMEOUT_1MINUTE }).catch(function (error) {
      logger.error('getAllTheBlocksPrice', finalUrl);
    });

    if (apiRes && apiRes.data) {
      const $ = cheerio.load(apiRes.data);
      const trs = $('.card-body div table tbody tr');
      for (let i = 0; i < trs.length; i++) {
        const key = $(trs[i]).find('td[aria-colindex="1"] a').text().trim();
        const forkName = key && key.replaceAll('-', '').toLowerCase();
        const forkPrice = $(trs[i]).find('td[aria-colindex="3"]').text().trim().replaceAll('$', '');
        coinsPrice[forkName] = parseFloat(forkPrice);
      }
    }
  } catch (e) {
    logger.error('getAllTheBlocksPrice', e);
  }

  return coinsPrice;
};

const getPosatPrice = async () => {
  const coinsPrice = {};

  try {
    const finalUrl = 'https://market.posat.io/api/prices';
    const apiRes = await axios.get(finalUrl, { timeout: TIMEOUT_1MINUTE }).catch(function (error) {
      logger.error('getPosatPrice-api', finalUrl);
    });
    const records = apiRes && apiRes.data;
    Object.keys(records).forEach(key => {
      const forkName = key && key.replaceAll('-', '').toLowerCase();
      if (records[key] >= 0) {
        coinsPrice[forkName] = parseFloat(records[key]);
      }
    });
  } catch (e) {
    logger.error('getPosatPrice', e);
  }

  return coinsPrice;
};

const getAllCoinsPrice = async () => {
  let coinsPrice = {};

  try {
    coinsPrice = await getPosatPrice();
    const atbPrice = await getAllTheBlocksPrice();
    Object.keys(atbPrice).forEach(key => {
      if (atbPrice[key] > 0 && !coinsPrice[key]) {
        coinsPrice[key] = atbPrice[key]; // only merge missing price
      }
    });
  } catch (e) {
    logger.error('getAllCoinsPrice', e);
  }

  return coinsPrice;
};

// alltheblocks
const getAllCoinsPriceATB = async () => {
  const coinsPrice = {};
  try {
    const finalUrl = getPriceUrl();
    const apiRes = await axios.get(finalUrl, { timeout: TIMEOUT_1MINUTE }).catch(function (error) {
      logger.error('getAllCoinsPrice-api', finalUrl);
    });
    const records = apiRes && apiRes.data;
    if (records && records.length > 0) {
      records.forEach(rc => {
        coinsPrice[rc.pathName] = rc.stats && rc.stats.priceUsd;
        if (coinsPrice[rc.pathName] < 0) coinsPrice[rc.pathName] = 0;
      });
    }
  } catch (e) {
    logger.error('getAllCoinsPrice', e);
  }
  return coinsPrice;
};

const getCoinBalance = async (blockchain, walletAdress) => {
  let balance = 0;

  try {
    const forkConfig = chainConfigs[blockchain];
    if (!forkConfig || !blockchain || !walletAdress) return balance;

    const finalUrl = getBalanceUrl(blockchain, walletAdress);
    const apiRes = await axios.get(finalUrl, { timeout: TIMEOUT_1MINUTE }).catch(function (error) {
      logger.error('getCoinBalance-api', finalUrl);
    });
    const apiBalance = apiRes && apiRes.data && apiRes.data.balance;
    if (apiBalance > 0) {
      balance = apiBalance / forkConfig.mojoDivider;
    }
  } catch (e) {
    logger.error('getCoinBalance', e);
  }

  return balance;
};

const getBlockchainInfo = (details) => {
  let chain_sync_to_time = null;
  let chain_height = 0;

  if (details) {
    const match = REG_CHAIN_INFO.exec(details);
    if (match && match[1] && match[2]) {
      chain_sync_to_time = new Date(match[1].replace('CST', ''));
      chain_height = match[2];
    }
  }

  return { chain_sync_to_time, chain_height };
};

const getWalletInfo = (details) => {
  let wallet_status = '';
  let wallet_height = 0;

  let match = REG_WALLET_STATUS.exec(details);
  if (match && match[1]) wallet_status = match[1];

  match = REG_WALLET_HEIGHT.exec(details);
  if (match && match[1]) wallet_height = toNumber(match[1]);

  let wallet_balance = getTotalBalance(details);
  if (wallet_balance > 0) wallet_balance = parseFloat(wallet_balance.toFixed(8));
  else wallet_balance = 0;

  return {
    wallet_status,
    wallet_height,
    wallet_balance
  };
};

const getTimeInSeconds = (n, str) => {
  if (n && str) {
    let mut = str.includes('second') ? 1 : 0;
    if (!mut) mut = str.includes('minute') ? 60 : 0;
    if (!mut) mut = str.includes('hour') ? 60 * 60 : 0;
    if (!mut) mut = str.includes('day') ? 60 * 60 * 24 : 0;
    if (!mut) mut = str.includes('week') ? 60 * 60 * 24 * 7 : 0;
    if (!mut) mut = str.includes('month') ? 60 * 60 * 24 * 30 : 0;

    if (mut) {
      return parseFloat(n) * mut;
    }
  }

  return 0;
}

const getETWHours = (str) => {
  try {
    const match = REG_ETW.exec(str);
    let n = 0;
    if (match) {
      n = getTimeInSeconds(match[1], match[2]) + getTimeInSeconds(match[4], match[5]);
    }

    return !isNaN(n) && isFinite(n) ? parseFloat((n / 3600).toFixed(1)) : str;
  } catch (e) {
    return str;
  }
};

const getFarmStyle = (status) => {
  if ('Farming' === status) return 'success';
  else if ('Syncing' === status) return 'warning';
  else return 'danger';
};

const getBlockchainStyle = (dt) => {
  const now = new Date().getTime();
  const lastReview = new Date(dt.updatedAt).getTime();
  if (now - lastReview > TIMEOUT_4HOUR) return 'danger';
  else if (dt.details.includes('Not Synced')) return 'warning';
  else if (!dt.details.includes('Full Node Synced')) return 'danger';

  return 'success';
};

const getConnectionStyle = (dt) => {
  const now = new Date().getTime();
  const lastReview = new Date(dt.updatedAt).getTime();
  if (now - lastReview > TIMEOUT_4HOUR) return 'danger';
  else if ((dt.details.match(/FULL_NODE/g) || []).length < 3) return 'warning';
  else if (!dt.details.includes('FULL_NODE')) return 'danger';

  return 'success';
};

const getWalletStyle = (dt) => {
  const now = new Date().getTime();
  const lastReview = new Date(dt.updatedAt).getTime();
  if (now - lastReview > TIMEOUT_4HOUR) return 'danger';
  else if (dt.details.includes('Not Synced')) return 'warning';
  else if (!dt.details.includes('Sync status: Synced')) return 'danger';

  return 'success';
};

const getKeyStyle = (dt) => {
  if (dt.details.includes('Fingerprint')) return 'success';
  else return 'danger';
};

const getFarmDetailStyle = (dt) => {
  const now = new Date().getTime();
  const lastReview = new Date(dt.updatedAt).getTime();
  if (now - lastReview > TIMEOUT_4HOUR) return 'danger';
  else if (dt.details && dt.details.includes('Not Synced')) return 'warning';
  else if (dt.details && !dt.details.includes('Farming status: Farming')) return 'danger';

  return 'success';
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
// const prices = await getAllCoinsPrice();
// console.log(prices);
//   const balance = await getCoinBalance('apple', 'apple18ds3fw56wtttg7xm2d9s4wul720xr8ex50us54t3kz74ylc7avzspa6mey');
// console.log(balance);
// console.log(getETWHours('2 weeks and 5 days'));
//   console.log(getTotalBalance(`
// Wallet height: 583353
// Sync status: Synced
// Balances, fingerprint: 512045812
// Wallet ID 1 type STANDARD_WALLET Chia Wallet
// -Total Balance: 12.25 sit (12250000000000 mojo)
// -Pending Total Balance: 12.25 sit (12250000000000 mojo)
// -Spendable: 12.25 sit (12250000000000 mojo)
// `));
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
  getAllCoinsPrice,
  getCoinBalance,
  getBlockchainInfo,
  getWalletInfo,
  getChiaPoolWalletId,
  getETWHours,
  getFarmStyle,
  getBlockchainStyle,
  getConnectionStyle,
  getWalletStyle,
  getKeyStyle,
  getFarmDetailStyle,
}