const CronJob = require('cron').CronJob;
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
}, null, true, 'America/Los_Angeles');

const twoMinuteJob = new CronJob(every2Minute, async () => {

}, null, true, 'America/Los_Angeles');

const fiveMinuteJob = new CronJob(every5Minute, () => {
  await updateFarm();
  await updateKey();
}, null, true, 'America/Los_Angeles');

const startAllJobs = () => {
  oneMinuteJob.start();
  twoMinuteJob.start();
  fiveMinuteJob.start();
};

module.exports = {
  startAllJobs,
};