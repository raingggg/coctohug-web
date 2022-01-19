const axios = require('axios');
const { Op } = require("sequelize");
const { Hand } = require('../models');
const { logger } = require('../utils/logger');
const { TIMEOUT_5SECOND } = require('../utils/jsUtil');
const { getWorkerToken } = require('../utils/chiaConfig');

const notifyWorkersWebAccessing = async () => {
  try {
    const data = await Hand.findAll({
      where: {
        mode: { [Op.in]: ['fullnode', 'farmer', 'wallet'] },
      }
    });

    for (let i = 0; i < data.length; i++) {
      try {
        const { url, hostname, blockchain } = data[i];
        if (url && blockchain) {
          const finalUrl = `${url}/blockchainsWorker/updateLastWebReviewPageAccessTime`;
          await axios.get(finalUrl, { timeout: TIMEOUT_5SECOND, headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
            logger.error('blockchainsWorker/updateLastWebReviewPageAccessTime', finalUrl);
          });
        }
      } catch (ex) {
        logger.error('notifyWorkersWebAccessing-one', ex);
      }
    }
  } catch (e) {
    logger.error('notifyWorkersWebAccessing', e);
  }
};

module.exports = {
  notifyWorkersWebAccessing,
}