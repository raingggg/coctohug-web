const os = require('os');
const path = require('path');
const { constants } = require('fs');
const { access } = require('fs/promises');
const requestIp = require('request-ip');
const {
  TIMEOUT_30MINUTE,
  isSampleByPercentage
} = require('./jsUtil');

const CONFIG_FILENAME = process.env['config_file'] || '../chia.json';
const CONTROLLER_HOST = process.env['controller_address'] || 'localhost'
const CONTROLLER_PORT = process.env['controller_web_port'] || '12630';
const WORKER_HOST = process.env['worker_address'] || process.env['controller_address'];
const WORKER_PORT = process.env['worker_web_port'];
const FORK_CODE_BRANCH = process.env['FORK_CODE_BRANCH'];
const FULLNODE_PROTOCOL_PORT = process.env['fullnode_protocol_port'];

const MODE = process.env['mode'] || 'fullnode';
const WEB_MODE = process.env['WEB_MODE'] || 'controller';

const SQL_LOG = false;
const CONTROLLER_SCHEME = 'http';

const homedir = os.homedir();
const hostname = os.hostname();
const accessToken = `tk-${Math.random()}`;
const simpleCache = {};

const getFullPath = (p) => {
  if (p.startsWith('/')) return p;
  else if (p.startsWith('./') || p.startsWith('../')) return path.resolve(__dirname, p);
  else return path.resolve(homedir, p);
};

const blockchainConfig = require(getFullPath(CONFIG_FILENAME));
Object.assign(blockchainConfig, {
  binary: getFullPath(blockchainConfig.binary),
  mainnet: getFullPath(blockchainConfig.mainnet),
  config: getFullPath(blockchainConfig.config),
  certificates: getFullPath(blockchainConfig.certificates),
  chainlog: getFullPath(blockchainConfig.chainlog),
  webLogFile: getFullPath(blockchainConfig.webLogFile),
  watchDogLogFile: getFullPath(blockchainConfig.watchDogLogFile),
  mncPath: getFullPath('.coctohug/mnc.txt'),
  coldWalletFile: getFullPath('.coctohug/coldwallet.json'),
  coctohugPath: getFullPath('.coctohug'),
  downloadsPath: getFullPath('.coctohug/downloads'),
});

const getHostname = () => {
  return process.env.worker_address || hostname;
};

const getControllerUrl = () => {
  return `${CONTROLLER_SCHEME}://${CONTROLLER_HOST}:${CONTROLLER_PORT}`;
};

const getWorkerUrl = () => {
  return `${CONTROLLER_SCHEME}://${WORKER_HOST}:${WORKER_PORT}`;
};

const getMode = () => {
  return MODE;
};

const isHarvesterMode = () => {
  return MODE.includes('harvester');
};

const isFullnodeMode = () => {
  return MODE.includes('fullnode');
};

const isFarmerMode = () => {
  return MODE.includes('farmer');
};

const isWalletMode = () => {
  return MODE === 'wallet';
};

const isStandardWalletMode = () => {
  return MODE === 'standard_wallet';
};

const getSqlitePath = () => {
  return getFullPath('.coctohug-web/db/coctohug.sqlite');
};

const isWebControllerMode = () => {
  return WEB_MODE === 'controller';
};

const getWebLogLevel = () => {
  return blockchainConfig.webLogLevel || "error";
};

const getCoctohugWebVersion = () => {
  return require('../package.json').version;
};

const hasMNCFile = async () => {
  let mncExists = false;
  try {
    await access(blockchainConfig.mncPath, constants.F_OK);
    mncExists = true;
  } catch (e) {
    console.error(`${blockchainConfig.mncPath} does not exist`);
  }
  return mncExists;
}

const getAccessToken = () => {
  return accessToken;
};

const isValidAccessToken = (token) => {
  return token === accessToken
};

const setWorkerToken = (hostname, blockchain, tk) => {
  simpleCache[`${hostname}${blockchain}`] = tk;
}

const getWorkerToken = (hostname, blockchain) => {
  return simpleCache[`${hostname}${blockchain}`] || 'error';
}

const setLastWebReviewPageAccessTime = () => {
  simpleCache['lastWebReviewPageAccessTime'] = new Date().getTime();
}

const shouldRunJobsNormally = (jobInterval) => {
  let shouldRun = false;

  const duration = new Date().getTime() - simpleCache['lastWebReviewPageAccessTime'];
  shouldRun = duration <= TIMEOUT_30MINUTE; // run jobs regularly in 30 minutes

  if (!shouldRun && jobInterval) {
    shouldRun = isSampleByPercentage(jobInterval);
  }

  return shouldRun;
}

const getIp = (req) => {
  return requestIp.getClientIp(req);
}

module.exports = {
  SQL_LOG,
  FORK_CODE_BRANCH,
  FULLNODE_PROTOCOL_PORT,
  blockchainConfig,
  getHostname,
  getControllerUrl,
  getWorkerUrl,
  getMode,
  isHarvesterMode,
  isFullnodeMode,
  isFarmerMode,
  isWalletMode,
  isStandardWalletMode,
  getSqlitePath,
  isWebControllerMode,
  getWebLogLevel,
  getCoctohugWebVersion,
  hasMNCFile,
  getAccessToken,
  isValidAccessToken,
  setWorkerToken,
  getWorkerToken,
  getIp,
  setLastWebReviewPageAccessTime,
  shouldRunJobsNormally,
};