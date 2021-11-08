const axios = require('axios');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getMode,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadFarmSummary } = require('../utils/chiaClient');

const mode = getMode();
const hostname = getHostname();

const updateFarm = async () => {
  try {
    const data = await loadFarmSummary();
    const payload = Object.assign({}, data, {
      hostname,
      blockchain,
      mode,
    });
    await axios.post(`${controllerUrl}/farms/update`, payload);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateFarm
}

