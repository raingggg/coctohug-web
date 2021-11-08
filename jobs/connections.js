const axios = require('axios');
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
    await axios.post(`${controllerUrl}/connections/update`, payload);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateConnection
}

