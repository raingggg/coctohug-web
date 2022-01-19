const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadConnectionsShow } = require('../utils/chiaClient');

const hostname = getHostname();
const controllerUrl = getControllerUrl();

const updateConnection = async () => {
  try {
    const data = await loadConnectionsShow();
    const payload = {
      hostname,
      blockchain,
      details: data,
    };
    const finalUrl = `${controllerUrl}/connections/update`;
    axios.post(finalUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(function (error) {
      logger.error('connections/update', finalUrl);
    });
  } catch (e) {
    logger.error('updateConnection-job', e);
  }
};

module.exports = {
  updateConnection
}

