const CronJob = require('cron').CronJob;
const { logger } = require('./logger');
const { isWebControllerMode, isHarvesterMode } = require('./chiaConfig');
const {
  updateWallet,
  updateFarm,
  updateConnection,
  updateKey,
  updateBlockchain,
  updateHand,
  emptyWorkerLogs,
} = require('../jobs');

const {
  updateHourlyColdwalletCoins,
  updateDailyWalletBalance,
  updateDailyColdwalletCoins,
  updateWeeklyColdwalletCoins,
  removeOutdatedNews,
  emptyControllerLogs,
  updateAllInOne,
} = require('../controllerJobs');

const everyMinute = '0 */1 * * * *';
const every5Minute = '0 */5 * * * *';
const every30Minute = '0 */30 * * * *';
const every1Hour = '0 0 */1 * * *';
const every4Hour = '0 0 */4 * * *';
const everyMidnight = '0 40 2 * * *';
const everyMondayMidnight = '0 40 3 * * 1';

const isWebController = isWebControllerMode();
const isNotHarvester = !isHarvesterMode();

const MAX_TRY = 10;
let currentTry = 0;
const immediateTryTasks = async () => {
  logger.info('immediateTryTasks start');

  try {
    if (currentTry < MAX_TRY) {
      currentTry += 1;
      if (isNotHarvester) await updateKey();
      await updateHand();
      logger.info('immediateTryTasks trying: ', currentTry);
    }
  } catch (e) {
    logger.error('immediateTryTasks', e);
  }

  logger.info('immediateTryTasks end');
};

const oneMinuteJob = new CronJob(everyMinute, async () => {
  logger.info('oneMinuteJob start');

  try {
    if (!isWebController) {
      await immediateTryTasks();
      if (isNotHarvester) await updateBlockchain();
    }
  } catch (e) {
    logger.error('oneMinuteJob', e);
  }

  logger.info('oneMinuteJob end');
}, null, true, 'America/Los_Angeles');

const fiveMinuteJob = new CronJob(every5Minute, async () => {
  logger.info('fiveMinuteJob start');

  try {
    if (!isWebController) {
      if (isNotHarvester) await updateFarm();
      if (isNotHarvester) await updateWallet();
      if (isNotHarvester) await updateConnection();
    } else {
      await updateAllInOne();
    }
  } catch (e) {
    logger.error('fiveMinuteJob', e);
  }

  logger.info('fiveMinuteJob end');
}, null, true, 'America/Los_Angeles');

const thirtyMinuteJob = new CronJob(every30Minute, async () => {
  logger.info('thirtyMinuteJob start');

  try {
    if (!isWebController) {
      await updateHand();
    }
  } catch (e) {
    logger.error('thirtyMinuteJob', e);
  }

  logger.info('thirtyMinuteJob end');
}, null, true, 'America/Los_Angeles');

const oneHourJob = new CronJob(every1Hour, async () => {
  logger.info('oneHourJob start');

  try {
    if (isWebController) {
      await updateHourlyColdwalletCoins();
    }
  } catch (e) {
    logger.error('oneHourJob', e);
  }

  logger.info('oneHourJob end');
}, null, true, 'America/Los_Angeles');

const fourHourJob = new CronJob(every4Hour, async () => {
  logger.info('fourHourJob start');

  try {
    if (!isWebController) {
      if (isNotHarvester) await updateKey();
    }
  } catch (e) {
    logger.error('fourHourJob', e);
  }

  logger.info('fourHourJob end');
}, null, true, 'America/Los_Angeles');

const oneDayJob = new CronJob(everyMidnight, async () => {
  logger.info('oneDayJob start');

  try {
    if (isWebController) {
      await updateDailyWalletBalance();
      await updateDailyColdwalletCoins();
      await removeOutdatedNews();
      await emptyControllerLogs();
    } else {
      await emptyWorkerLogs();
    }
  } catch (e) {
    logger.error('oneDayJob', e);
  }

  logger.info('oneDayJob end');
}, null, true, 'America/Los_Angeles');

const oneWeekJob = new CronJob(everyMondayMidnight, async () => {
  logger.info('oneWeekJob start');

  try {
    if (isWebController) {
      await updateWeeklyColdwalletCoins();
    }
  } catch (e) {
    logger.error('oneWeekJob', e);
  }

  logger.info('oneWeekJob end');
}, null, true, 'America/Los_Angeles');

const startAllJobs = async () => {
  logger.info('all jobs start');

  oneMinuteJob.start();
  fiveMinuteJob.start();
  thirtyMinuteJob.start();
  oneHourJob.start();
  fourHourJob.start();
  oneDayJob.start();
  oneWeekJob.start();

  logger.info('all jobs end');
};

module.exports = {
  startAllJobs,
};