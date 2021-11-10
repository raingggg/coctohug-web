const os = require('os');
const path = require('path');
const CONFIG_FILENAME = process.env['blockchain'] ? `/coctohug/web/${process.env['blockchain']}.json` : '../chia.json';
const CONTROLLER_HOST = process.env['controller_address'] || 'localhost'
const CONTROLLER_PORT = process.env['controller_web_port'] || '12630';
const MODE = process.env['mode'];
const WEB_MODE = process.env['WEB_MODE'] || 'controller';

const SQL_LOG = false;
const CONTROLLER_SCHEME = 'http';
const blockchainConfig = require(CONFIG_FILENAME);

const homedir = os.homedir();
const hostname = os.hostname();

Object.assign(blockchainConfig, {
  binary: path.resolve(homedir, blockchainConfig.binary),
  mainnet: path.resolve(homedir, blockchainConfig.mainnet),
  config: path.resolve(homedir, blockchainConfig.config),
});

const getHostname = () => {
  return process.env.worker_address || hostname;
};

const getControllerUrl = () => {
  return `${CONTROLLER_SCHEME}://${CONTROLLER_HOST}:${CONTROLLER_PORT}`;
};

const getMode = () => {
  return MODE;
};

const getSqlitePath = () => {
  return path.resolve(homedir, '.coctohug-web/db/coctohug.sqlite');
};

const isWebControllerMode = () => {
  return WEB_MODE === 'controller';
};

module.exports = {
  SQL_LOG,
  blockchainConfig,
  getHostname,
  getControllerUrl,
  getMode,
  getSqlitePath,
  isWebControllerMode,
};