const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadWalletShow } = require('../utils/chiaClient');

const hostname = getHostname();
const controllerUrl = getControllerUrl();

const updateWallet = async () => {
  try {
    const data = await loadWalletShow();
    const payload = {
      hostname,
      blockchain,
      details: data,
    };
    axios.post(`${controllerUrl}/wallets/update`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    logger.error(e);
  }
};

module.exports = {
  updateWallet
}

