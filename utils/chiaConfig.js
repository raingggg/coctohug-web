const os = require('os');
const path = require('path');
const { constants } = require('fs');
const { access } = require('fs/promises');
const requestIp = require('request-ip');

const CONFIG_FILENAME = process.env['config_file'] || '../chia.json';
const CONTROLLER_HOST = process.env['controller_address'] || 'localhost'
const CONTROLLER_PORT = process.env['controller_web_port'] || '12630';
const WORKER_HOST = process.env['worker_address'] || process.env['controller_address'];
const WORKER_PORT = process.env['worker_web_port'];

const MODE = process.env['mode'];
const WEB_MODE = process.env['WEB_MODE'] || 'controller';

const SQL_LOG = false;
const CONTROLLER_SCHEME = 'http';

const homedir = os.homedir();
const hostname = os.hostname();
const accessToken = `tk-${Math.random()}`;
const workerToken = {};

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
  mncPath: getFullPath('.coctohug/mnc.txt'),
  coldWalletFile: getFullPath('.coctohug/coldwallet.json'),
  coctohugPath: getFullPath('.coctohug'),
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
  workerToken[`${hostname}${blockchain}`] = tk;
}

const getWorkerToken = (hostname, blockchain) => {
  return workerToken[`${hostname}${blockchain}`] || 'error';
}

const getIp = (req) => {
  return requestIp.getClientIp(req);
}

module.exports = {
  SQL_LOG,
  blockchainConfig,
  getHostname,
  getControllerUrl,
  getWorkerUrl,
  getMode,
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
};