const CronJob = require('cron').CronJob;

const everyMinute = '*/1 * * * *';
// const every5Minute = '*/5 * * * *';

const handJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const farmJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const plotsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const challengesJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const walletsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const blockchainsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const connectionsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const keysJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const newsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const controllerJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const plotnftsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const pointsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const poolsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const partialsJob = new CronJob(everyMinute, function () {
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

const startAllJobs = () => {
    handJob.start();
    farmJob.start();
    plotsJob.start();
    challengesJob.start();
    walletsJob.start();
    blockchainsJob.start();
    newsJob.start();
    controllerJob.start();
    plotnftsJob.start();
    pointsJob.start();
    poolsJob.start();
    partialsJob.start();
};

module.exports = {
    handJob,
    farmJob,
    plotsJob,
    challengesJob,
    walletsJob,
    blockchainsJob,
    newsJob,
    controllerJob,
    plotnftsJob,
    pointsJob,
    poolsJob,
    partialsJob,
    startAllJobs,
};