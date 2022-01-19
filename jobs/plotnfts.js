const axios = require('axios');
const { logger } = require('../utils/logger');
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
    const finalUrl = `${controllerUrl}/plotnfts/update`;
    await axios.post(finalUrl, payload).catch(function (error) {
      logger.error('plotnfts/update', finalUrl);
    });
  } catch (e) {
    logger.error('updateWallet', e);
  }
};

module.exports = {
  updateWallet
}

