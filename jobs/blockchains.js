const axios = require('axios');
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
    await axios.post(`${controllerUrl}/blockchains/update`, payload);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateBlockchain
}

