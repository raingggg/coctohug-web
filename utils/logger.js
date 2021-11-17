const log4js = require("log4js");
const { blockchainConfig, getWebLogLevel } = require('./chiaConfig');

const logLevel = getWebLogLevel();
log4js.configure({
  appenders: { cheese: { type: "file", filename: blockchainConfig.webLogFile } },
  categories: { default: { appenders: ["cheese"], level: logLevel } }
});

const logger = log4js.getLogger("cheese");

module.exports = {
  logger
};