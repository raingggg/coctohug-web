const { ChiaWatchDog } = require('chia-watch-dog');
const axios = require('axios');
const { logger } = require('./logger');
const {
  blockchainConfig,
  getHostname,
  getControllerUrl,
  isWebControllerMode,
} = require('./chiaConfig');
const { chainConfigs } = require('./chainConfigs');

const { chainlog, blockchain } = blockchainConfig;
const hostname = getHostname();
const controllerUrl = getControllerUrl();
const isWebController = isWebControllerMode();

const startWatchDog = () => {
  if (isWebController) return;

  try {
    const cwd = new ChiaWatchDog(chainlog);
    cwd.sampleWithPercentate(1); // 1% is enough for monitoring purpose

    cwd.on('dog', (evs) => {
      postEvents(evs);
    });

    cwd.on('dailydog', (evs) => {
      postDailyEvents(evs);
    });

    cwd.start();
  } catch (e) {
    logger.error('startWatchDog failed: ', e);
  }
};

const postEvents = (evs) => {
  if (!Array.isArray(evs)) {
    logger.error('postEvents evs is not an array: ', evs);
  }

  evs.forEach(ev => {
    try {
      const payload = {
        hostname,
        blockchain,
        priority: ev.priority,
        service: ev.service,
        type: ev.message.type,
        message: ev.message.msg,
      };

      const cc = chainConfigs[blockchain];
      if ('EVT_INTIME_RECEIVE_COIN' === payload.type && ev.message.amountCoins && cc && cc.mojoMultiplier) {
        payload.message = `Cha-ching! Just received ${ev.message.amountCoins * cc.mojoMultiplier} coins ☘️`;
      }

      const finalUrl = `${controllerUrl}/news/add`;
      axios.post(finalUrl, payload, {
        headers: { 'Content-Type': 'application/json' }
      }).catch(function (error) {
        logger.error('postEvents-one', finalUrl);
      });
    } catch (e) {
      logger.error('postEvents', e);
    }
  });
};


const postDailyEvents = (evs) => {
  if (!Array.isArray(evs)) {
    logger.error('postDailyEvents evs is not an array: ', evs);
  }

  try {
    let msg = "Hello farmer! 👋 Here's what happened in the last 24 hours:\n\n";

    let tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_RECEIVE_COIN');
    if (tempEv) {
      const cc = chainConfigs[blockchain];
      if (cc && cc.mojoMultiplier) {
        msg += `Received ☘️: ${tempEv.message.totalAddedCoins * cc.mojoMultiplier} coins`;
      } else {
        msg += `${tempEv.message.msg}\n`;
      }
    }

    tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_PROOF_FOUND');
    if (tempEv) msg += `${tempEv.message.msg}\n`;

    tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_PARITAL_SUBMITTED');
    if (tempEv) msg += `- ${tempEv.message.msg}\n`;

    tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_BLOCK_FOUND');
    if (tempEv) msg += `- ${tempEv.message.msg}\n`;

    tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_DISK_SEARCH');
    if (tempEv) msg += `${tempEv.message.msg}\n`;

    tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_NUMBER_PLOTS');
    if (tempEv) msg += `${tempEv.message.msg}\n`;

    tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_ELIGIGLE_PLOTS');
    if (tempEv) msg += `${tempEv.message.msg}\n`;

    tempEv = evs.find(ev => ev.message && ev.message.type === 'EVT_DAILY_SKIP_POINT');
    if (tempEv) msg += `${tempEv.message.msg}\n`;

    const payload = {
      hostname,
      blockchain,
      priority: 'low',
      service: 'COCTHUG_WEB',
      type: 'EVT_DAILY_ALL_IN_ONE',
      message: msg,
    };
    const finalUrl = `${controllerUrl}/news/add`;
    axios.post(finalUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(function (error) {
      logger.error('postDailyEvents-one', finalUrl);
    });
  } catch (e) {
    logger.error('postDailyEvents', e);
  }
};

module.exports = {
  startWatchDog
}