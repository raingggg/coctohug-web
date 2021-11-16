const { ChiaWatchDog } = require('chia-watch-dog');
const axios = require('axios');
const { logger } = require('./logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
  isWebControllerMode,
} = require('./chiaConfig');

const hostname = getHostname();
const controllerUrl = getControllerUrl();
const isWebController = isWebControllerMode();

const startWatchDog = () => {
  if (isWebController) return;

  const cwd = new ChiaWatchDog(blockchainConfig.chainlog);

  cwd.on('dog', (evs) => {
    postEvents(evs);
  });

  cwd.on('dailydog', (evs) => {
    postEvents(evs);
  });

  cwd.start();
};

const postEvents = (evs) => {
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
      axios.post(`${controllerUrl}/news/add`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      logger.error(e);
    }
  });
};

module.exports = {
  startWatchDog
}