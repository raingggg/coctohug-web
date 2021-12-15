const { getConnection } = require('../utils/sqlConnection');
const { getFormattedDaysBefore } = require('../utils/jsUtil');
const { logger } = require('../utils/logger');

const sequelize = getConnection();
const removeOutdatedNews = async () => {
  try {
    const time = getFormattedDaysBefore(2);
    await sequelize.query(`DELETE from News where createdAt < '${time}'`);
  } catch (e) {
    logger.error('removeOutdatedNews', e);
  }
};

module.exports = {
  removeOutdatedNews
};