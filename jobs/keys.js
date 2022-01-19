const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadKeysShow } = require('../utils/chiaClient');

const hostname = getHostname();
const controllerUrl = getControllerUrl();

const updateKey = async () => {
  try {
    const data = await loadKeysShow();
    const payload = {
      hostname,
      blockchain,
      details: data,
    };
    const finalUrl = `${controllerUrl}/keys/update`;
    axios.post(finalUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(function (error) {
      logger.error('keys/update', finalUrl);
    });
  } catch (e) {
    logger.error('updateKey-job', e);
  }
};

module.exports = {
  updateKey
}

