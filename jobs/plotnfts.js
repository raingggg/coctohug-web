const axios = require('axios');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadPlotnftShow } = require('../utils/chiaClient');

const hostname = getHostname();
const controllerUrl = getControllerUrl();

const updateWallet = async () => {
  try {
    const data = await loadPlotnftShow();
    const payload = {
      hostname,
      blockchain,
      details: data,
    };
    await axios.post(`${controllerUrl}/plotnfts/update`, payload);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateWallet
}

