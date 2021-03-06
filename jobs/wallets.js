const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
} = require('../utils/chiaConfig');
const { loadWalletShow, getColdWalletAddress } = require('../utils/chiaClient');

const hostname = getHostname();
const controllerUrl = getControllerUrl();

const updateWallet = async () => {
  try {
    const data = await loadWalletShow();
    const coldWallet = await getColdWalletAddress();
    const payload = {
      hostname,
      blockchain,
      details: data,
      coldWallet,
    };
    const finalUrl = `${controllerUrl}/wallets/update`;
    axios.post(finalUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(function (error) {
      logger.error('wallets/update', finalUrl);
    });
  } catch (e) {
    logger.error('updateWallet-job', e);
  }
};

module.exports = {
  updateWallet
}

