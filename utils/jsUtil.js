const TIMEOUT_5SECOND = 5 * 1000;
const TIMEOUT_1MINUTE = 60 * 1000;
const TIMEOUT_2MINUTE = 2 * 60 * 1000;
const TIMEOUT_3MINUTE = 3 * 60 * 1000;
const TIMEOUT_5MINUTE = 5 * 60 * 1000;
const TIMEOUT_10MINUTE = 10 * 60 * 1000;
const TIMEOUT_15MINUTE = 15 * 60 * 1000;
const TIMEOUT_30MINUTE = 30 * 60 * 1000;
const TIMEOUT_60MINUTE = 60 * 60 * 1000;
const TIMEOUT_90MINUTE = 90 * 60 * 1000;

const SAMPLE_PERCENTAGE_HOUR = {
  '1m': 100 * 1 / 60,
  '5m': 100 * 5 / 60,
  '30m': 100 * 30 / 60,
};

const getLastHourDates = () => {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - 1);
  startDate.setMinutes(0);
  startDate.setSeconds(0);

  const endDate = new Date();
  endDate.setHours(startDate.getHours());
  endDate.setMinutes(59);
  endDate.setSeconds(59);

  return { startDate, endDate };
};

const getLastDayDates = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);

  const endDate = new Date();
  endDate.setDate(startDate.getDate());
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);

  return { startDate, endDate };
};

const getLastWeekDates = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (startDate.getDay() + 6) % 7); //  set to Monday of this week
  startDate.setDate(startDate.getDate() - 7); // set to previous Monday
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);

  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);

  return { startDate, endDate };
};

const getDaysBefore = (days) => {
  const startDate = new Date();
  if (days) {
    startDate.setDate(startDate.getDate() - days);
  }
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);

  return startDate;
};

const formattedDateStr = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1) % 13}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const getFormattedDaysBefore = (days) => {
  return formattedDateStr(getDaysBefore(days));
};

const toNumber = (anything) => {
  let result = 0;

  try {
    result = parseFloat(anything);
    if (!result) result = 0;
  } catch (e) { }

  return result;
};

function getRandomDurationByMinutes(minutes) {
  return Math.random() * 60 * 1000 * minutes;
}

function isSampleByPercentage(percent) {
  return Math.ceil(Math.random() * 100) <= percent;
}

module.exports = {
  TIMEOUT_5SECOND,
  TIMEOUT_1MINUTE,
  TIMEOUT_2MINUTE,
  TIMEOUT_3MINUTE,
  TIMEOUT_5MINUTE,
  TIMEOUT_10MINUTE,
  TIMEOUT_15MINUTE,
  TIMEOUT_30MINUTE,
  TIMEOUT_60MINUTE,
  TIMEOUT_90MINUTE,
  SAMPLE_PERCENTAGE_HOUR,
  getLastHourDates,
  getLastDayDates,
  getLastWeekDates,
  getDaysBefore,
  getFormattedDaysBefore,
  toNumber,
  getRandomDurationByMinutes,
  isSampleByPercentage,
};