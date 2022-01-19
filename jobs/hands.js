const axios = require('axios');
const { logger } = require('../utils/logger');
const {
  blockchainConfig: { blockchain },
  getHostname,
  getControllerUrl,
  getWorkerUrl,
  getMode,
  getAccessToken,
  FORK_CODE_BRANCH,
  FULLNODE_PROTOCOL_PORT,
} = require('../utils/chiaConfig');
const { loadAllVersions } = require('../utils/chiaClient');

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
      protocol_port: FULLNODE_PROTOCOL_PORT,
      fork_version: FORK_CODE_BRANCH,
    };
    const finalUrl = `${controllerUrl}/hands/update`;
    axios.post(finalUrl, payload, {
      headers: { 'Content-Type': 'application/json', 'tk': getAccessToken() }
    }).catch(function (error) {
      logger.error('hands/update', finalUrl);
    });
  } catch (e) {
    logger.error('updateHand-job', e);
  }
};

module.exports = {
  updateHand
}
