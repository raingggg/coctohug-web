const TIMEOUT_1MINUTE = 60 * 1000;
const TIMEOUT_2MINUTE = 2 * 60 * 1000;

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
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const getFormattedDaysBefore = (days) => {
  return formattedDateStr(getDaysBefore(days));
};

module.exports = {
  TIMEOUT_1MINUTE,
  TIMEOUT_2MINUTE,
  getLastHourDates,
  getLastDayDates,
  getLastWeekDates,
  getDaysBefore,
  getFormattedDaysBefore,
};