const CronJob = require('cron').CronJob;
const { logger } = require('./logger');
const { isWebControllerMode } = require('./chiaConfig');
const {
  updateWallet,
  updateFarm,
  updateConnection,
  updateKey,
  updateBlockchain,
  updateHand,
} = require('../jobs');

const everyMinute = '0 */1 * * * *';
const every5Minute = '0 */5 * * * *';
const every30Minute = '0 */30 * * * *';
const every4Hour = '0 0 */4 * * *';

const isWebController = isWebControllerMode();

const MAX_TRY = 10;
let currentTry = 0;
const immediateTryTasks = async () => {
  logger.info('immediateTryTasks start');
  if (currentTry < MAX_TRY) {
    currentTry += 1;
    await updateKey();
    await updateHand();
    logger.info('immediateTryTasks trying: ', currentTry);
  }
  logger.info('immediateTryTasks end');
};

const oneMinuteJob = new CronJob(everyMinute, async () => {
  logger.info('oneMinuteJob start');
  if (!isWebController) {
    await immediateTryTasks();
    await updateBlockchain();
  }
  logger.info('oneMinuteJob end');
}, null, true, 'America/Los_Angeles');

const fiveMinuteJob = new CronJob(every5Minute, async () => {
  logger.info('fiveMinuteJob start');
  if (!isWebController) {
    await updateFarm();
    await updateWallet();
    await updateConnection();
  }
  logger.info('fiveMinuteJob end');
}, null, true, 'America/Los_Angeles');

const thirtyMinuteJob = new CronJob(every30Minute, async () => {
  logger.info('thirtyMinuteJob start');
  if (!isWebController) {
    await updateHand();
  }
  logger.info('thirtyMinuteJob end');
}, null, true, 'America/Los_Angeles');

const fourHourJob = new CronJob(every4Hour, async () => {
  logger.info('fourHourJob start');
  if (!isWebController) {
    await updateKey();
  }
  logger.info('fourHourJob end');
}, null, true, 'America/Los_Angeles');

const startAllJobs = async () => {
  logger.info('all jobs start');
  // start jobs in hand mode only
  if (!isWebController) {
    oneMinuteJob.start();
    fiveMinuteJob.start();
    thirtyMinuteJob.start();
    fourHourJob.start();
  }
  logger.info('all jobs end');
};

module.exports = {
  startAllJobs,
};