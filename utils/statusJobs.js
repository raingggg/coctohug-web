const CronJob = require('cron').CronJob;
const { logger } = require('./logger');
const {
  getRandomDurationByMinutes,
  SAMPLE_PERCENTAGE_HOUR,
} = require('./jsUtil');

const {
  isWebControllerMode,
  isHarvesterMode,
  isFullnodeMode,
  isFarmerMode,
  isWalletMode,
  isStandardWalletMode,
  shouldRunJobsNormally,
} = require('./chiaConfig');

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
const isFullnode = isFullnodeMode();
const isFarmer = isFarmerMode();
const isWallet = isWalletMode();
const isStandardWallet = isStandardWalletMode();
const isHarvester = isHarvesterMode();

const isNotHarvester = !isHarvester;
const hasPeers = isFullnode || isFarmer || isStandardWallet;

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

  // build initial connection when web starts
  setTimeout(async () => {
    try {
      if (!isWebController) {
        await immediateTryTasks();
      }
    } catch (e) {
      logger.error('oneMinuteJob', e);
    }
  }, getRandomDurationByMinutes(0.8));

  if (!shouldRunJobsNormally(SAMPLE_PERCENTAGE_HOUR['1m'])) return;
  // put normal 1 minute jobs below

  logger.info('oneMinuteJob end');
}, null, true, 'America/Los_Angeles');

const fiveMinuteJob = new CronJob(every5Minute, async () => {
  logger.info('fiveMinuteJob start');
  if (!shouldRunJobsNormally(SAMPLE_PERCENTAGE_HOUR['5m'])) return;

  setTimeout(async () => {
    try {
      if (!isWebController) {
        if (hasPeers) await updateFarm();
        if (isNotHarvester) await updateWallet();
        if (hasPeers) await updateBlockchain();
        if (hasPeers) await updateConnection();
      } else {
        await updateAllInOne();
      }
    } catch (e) {
      logger.error('fiveMinuteJob', e);
    }
  }, getRandomDurationByMinutes(2));

  logger.info('fiveMinuteJob end');
}, null, true, 'America/Los_Angeles');

const thirtyMinuteJob = new CronJob(every30Minute, async () => {
  logger.info('thirtyMinuteJob start');
  if (!shouldRunJobsNormally(SAMPLE_PERCENTAGE_HOUR['30m'])) return;

  setTimeout(async () => {
    try {
      if (!isWebController) {
        await updateHand();
      }
    } catch (e) {
      logger.error('thirtyMinuteJob', e);
    }
  }, getRandomDurationByMinutes(20));

  logger.info('thirtyMinuteJob end');
}, null, true, 'America/Los_Angeles');

const oneHourJob = new CronJob(every1Hour, async () => {
  logger.info('oneHourJob start');

  setTimeout(async () => {
    try {
      if (isWebController) {
        await updateHourlyColdwalletCoins();
      }
    } catch (e) {
      logger.error('oneHourJob', e);
    }
  }, getRandomDurationByMinutes(20));

  logger.info('oneHourJob end');
}, null, true, 'America/Los_Angeles');

const fourHourJob = new CronJob(every4Hour, async () => {
  logger.info('fourHourJob start');

  setTimeout(async () => {
    try {
      if (!isWebController) {
        if (isNotHarvester) await updateKey();
      } else {
        await updateDailyWalletBalance();
      }
    } catch (e) {
      logger.error('fourHourJob', e);
    }
  }, getRandomDurationByMinutes(180));

  logger.info('fourHourJob end');
}, null, true, 'America/Los_Angeles');

const oneDayJob = new CronJob(everyMidnight, async () => {
  logger.info('oneDayJob start');

  setTimeout(async () => {
    try {
      if (isWebController) {
        await updateDailyColdwalletCoins();
        await removeOutdatedNews();
        await emptyControllerLogs();
      } else {
        await emptyWorkerLogs();
      }
    } catch (e) {
      logger.error('oneDayJob', e);
    }
  }, getRandomDurationByMinutes(180));

  logger.info('oneDayJob end');
}, null, true, 'America/Los_Angeles');

const oneWeekJob = new CronJob(everyMondayMidnight, async () => {
  logger.info('oneWeekJob start');

  setTimeout(async () => {
    try {
      if (isWebController) {
        await updateWeeklyColdwalletCoins();
      }
    } catch (e) {
      logger.error('oneWeekJob', e);
    }
  }, getRandomDurationByMinutes(180));

  logger.info('oneWeekJob end');
}, null, true, 'America/Los_Angeles');

const thirtyMinuteImportantJob = new CronJob(every30Minute, async () => {
  logger.info('thirtyMinuteImportantJob start');

  setTimeout(async () => {
    try {
      if (!isWebController) {
        if (hasPeers) await updateFarm();
      }
    } catch (e) {
      logger.error('thirtyMinuteImportantJob', e);
    }
  }, getRandomDurationByMinutes(5));

  logger.info('thirtyMinuteImportantJob end');
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

  thirtyMinuteImportantJob.start();

  logger.info('all jobs end');
};

module.exports = {
  startAllJobs,
};