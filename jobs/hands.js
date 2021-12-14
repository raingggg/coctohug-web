const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
  getWorkerUrl,
  getMode,
} = require('../utils/chiaConfig');
const { loadAllVersions } = require('../utils/chiaClient');
const { getAccessToken } = require('../utils/chiaConfig');

const hostname = getHostname();
const controllerUrl = getControllerUrl();
const mode = getMode();
const url = getWorkerUrl();

const updateHand = async () => {
  try {
    const versions = await loadAllVersions();
    const payload = {
      hostname,
      blockchain,
      mode,
      url,
      versions,
    };
    axios.post(`${controllerUrl}/hands/update`, payload, {
      headers: { 'Content-Type': 'application/json', 'tk': getAccessToken() }
    }).catch(function (error) {
      logger.error('hands/update', error);
    });
  } catch (e) {
    logger.error('updateHand-job', e);
  }
};

module.exports = {
  updateHand
}
