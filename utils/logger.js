const log4js = require("log4js");
const { getWebLogLevel } = require('./chiaConfig');

const logLevel = getWebLogLevel();
log4js.configure({
  appenders: { cheese: { type: "file", filename: "web.log" } },
  categories: { default: { appenders: ["cheese"], level: logLevel } }
});

const logger = log4js.getLogger("cheese");

module.exports = {
  logger
};