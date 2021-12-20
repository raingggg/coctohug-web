const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { TIMEOUT_1MINUTE } = require('../utils/jsUtil');
const { blockchainConfig } = require('../utils/chiaConfig');

const { chainlog, webLogFile, watchDogLogFile } = blockchainConfig;

const emptyWorkerLogs = async () => {
  try {
    await exec(`echo '' > ${chainlog}`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    await exec(`echo '' > ${webLogFile}`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
    await exec(`echo '' > ${watchDogLogFile}`, { timeout: TIMEOUT_1MINUTE, killSignal: 'SIGKILL' });
  } catch (e) {
    logger.error('emptyWorkerLogs-job', e);
  }
};

module.exports = {
  emptyWorkerLogs
}
