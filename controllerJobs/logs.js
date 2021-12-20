const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { TIMEOUT_1MINUTE } = require('../utils/jsUtil');
const { blockchainConfig } = require('../utils/chiaConfig');

const { webLogFile, watchDogLogFile } = blockchainConfig;

const emptyControllerLogs = async () => {
  try {
    await exec(`echo '' > ${webLogFile}`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    await exec(`echo '' > ${watchDogLogFile}`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
  } catch (e) {
    logger.error('emptyControllerLogs-job', e);
  }
};

module.exports = {
  emptyControllerLogs
}
