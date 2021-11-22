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
    axios.post(`${controllerUrl}/connections/update`, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(function (error) {
      logger.error(error);
    });
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateConnection
}

