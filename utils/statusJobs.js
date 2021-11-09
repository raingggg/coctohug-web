const CronJob = require('cron').CronJob;
const { logger } = require('./logger');
const {
  updateWallet,
  updateFarm,
  updateConnection,
  updateKey,
  updateBlockchain,
} = require('../jobs');

const everyMinute = '*/1 * * * *';
const every2Minute = '*/2 * * * *';
const every5Minute = '*/5 * * * *';

const oneMinuteJob = new CronJob(everyMinute, async () => {
  logger.info('oneMinuteJob start');
  await updateWallet();
  await updateConnection();
  await updateBlockchain();
  logger.info('oneMinuteJob end');
}, null, true, 'America/Los_Angeles');

const twoMinuteJob = new CronJob(every2Minute, async () => {
  logger.info('twoMinuteJob start');
  logger.info('twoMinuteJob end');
}, null, true, 'America/Los_Angeles');

const fiveMinuteJob = new CronJob(every5Minute, async () => {
  logger.info('fiveMinuteJob start');
  await updateFarm();
  await updateKey();
  logger.info('fiveMinuteJob end');
}, null, true, 'America/Los_Angeles');

const startAllJobs = () => {
  logger.info('all jobs start');
  // oneMinuteJob.start();
  // twoMinuteJob.start();
  // fiveMinuteJob.start();
  logger.info('all jobs end');
};

module.exports = {
  startAllJobs,
};