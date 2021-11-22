const log4js = require("log4js");
const { blockchainConfig, getWebLogLevel } = require('./chiaConfig');

const logLevel = getWebLogLevel();
log4js.configure({
  appenders: { cchweb: { type: "file", filename: blockchainConfig.webLogFile } },
  categories: { default: { appenders: ["cchweb"], level: logLevel } }
});

const logger = log4js.getLogger("cchweb");

module.exports = {
  logger
};