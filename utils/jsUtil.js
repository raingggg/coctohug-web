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

module.exports = {
  getLastHourDates,
  getLastDayDates,
  getLastWeekDates,
};