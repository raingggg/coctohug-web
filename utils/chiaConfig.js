const os = require('os');
const path = require('path');
const CONFIG_FILENAME = process.env['config_file'] || '../chia.json';
const CONTROLLER_HOST = process.env['controller_address'] || 'localhost'
const CONTROLLER_PORT = process.env['controller_web_port'] || '12630';
const MODE = process.env['mode'];
const WEB_MODE = process.env['WEB_MODE'] || 'controller';

const SQL_LOG = false;
const CONTROLLER_SCHEME = 'http';
const blockchainConfig = require(CONFIG_FILENAME);

const homedir = os.homedir();
const hostname = os.hostname();

const getFullPath = (p) => {
  if (p.startsWith('/')) return p;
  else return path.resolve(homedir, p);
};

Object.assign(blockchainConfig, {
  binary: getFullPath(blockchainConfig.binary),
  mainnet: getFullPath(blockchainConfig.mainnet),
  config: getFullPath(blockchainConfig.config),
});

const getHostname = () => {
  return process.env.worker_address || hostname;
};

const getControllerUrl = () => {
  console.error('getControllerUrl', `${CONTROLLER_SCHEME}://${CONTROLLER_HOST}:${CONTROLLER_PORT}`);
  return `${CONTROLLER_SCHEME}://${CONTROLLER_HOST}:${CONTROLLER_PORT}`;
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

module.exports = {
  SQL_LOG,
  blockchainConfig,
  getHostname,
  getControllerUrl,
  getMode,
  getSqlitePath,
  isWebControllerMode,
  getWebLogLevel,
};