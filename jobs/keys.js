const axios = require('axios');
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
    await axios.post(`${controllerUrl}/keys/update`, payload);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateKey
}

