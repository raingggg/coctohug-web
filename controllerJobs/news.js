const { getConnection } = require('../utils/sqlConnection');
const { getFormattedDaysBefore } = require('../utils/jsUtil');
const { logger } = require('../utils/logger');

const sequelize = getConnection();
const removeOutdatedNews = async () => {
  try {
    let time = getFormattedDaysBefore(2);
    await sequelize.query(`DELETE from News where type != 'EVT_WEEKLY_ALL_IN_ONE' and createdAt < '${time}'`);

    // clear any message longer than 2 weeks
    if (new Date().getDay() === 3) {
      time = getFormattedDaysBefore(16);
      await sequelize.query(`DELETE from News where createdAt < '${time}'`);
    }
  } catch (e) {
    logger.error('removeOutdatedNews', e);
  }
};


module.exports = {
  removeOutdatedNews
};