const CronJob = require('cron').CronJob;
const { logger } = require('./logger');
const {
  updateWallet,
  updateFarm,
  updateConnection,
  updateKey,
} = require('../jobs');

const everyMinute = '*/1 * * * *';
const every2Minute = '*/2 * * * *';
const every5Minute = '*/5 * * * *';

const oneMinuteJob = new CronJob(everyMinute, async () => {
  await updateWallet();
  await updateConnection();
  logger.info('oneMinuteJob started');
}, null, true, 'America/Los_Angeles');

const twoMinuteJob = new CronJob(every2Minute, async () => {
  logger.info('twoMinuteJob started');
}, null, true, 'America/Los_Angeles');

const fiveMinuteJob = new CronJob(every5Minute, async () => {
  await updateFarm();
  await updateKey();
  logger.info('fiveMinuteJob started');
}, null, true, 'America/Los_Angeles');

const startAllJobs = () => {
  logger.info('starting all jobs');
  oneMinuteJob.start();
  twoMinuteJob.start();
  fiveMinuteJob.start();
  logger.info('all jobs started');
};

module.exports = {
  startAllJobs,
};