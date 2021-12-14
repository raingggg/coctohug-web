const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadBlockchainShow } = require('../utils/chiaClient');

const hostname = getHostname();
const controllerUrl = getControllerUrl();

const updateBlockchain = async () => {
  try {
    const data = await loadBlockchainShow();
    const payload = {
      hostname,
      blockchain,
      details: data,
    };
    axios.post(`${controllerUrl}/blockchains/update`, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(function (error) {
      logger.error('blockchains/update', error);
    });
  } catch (e) {
    logger.error('updateBlockchain-job', e);
  }
};

module.exports = {
  updateBlockchain
}

