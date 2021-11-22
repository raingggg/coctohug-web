const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getMode,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadFarmSummary } = require('../utils/chiaClient');

const mode = getMode();
const hostname = getHostname();
const controllerUrl = getControllerUrl();

const updateFarm = async () => {
  try {
    const data = await loadFarmSummary();
    const payload = Object.assign({}, data, {
      hostname,
      blockchain,
      mode,
    });
    axios.post(`${controllerUrl}/farms/update`, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(function (error) {
      logger.error(error);
    });
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateFarm
}

