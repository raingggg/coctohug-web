var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { Op } = require("sequelize");
const { Connection, Hand } = require('../models');
const { parseConnecitons } = require('../utils/chiaParser');
const { getWorkerToken } = require('../utils/chiaConfig');
const { getConnectionStyle } = require('../utils/blockUtil');

const UNSYNC_THRESHHOLD = 10 * 60 * 1000; // 10 mins
router.get('/', async (req, res, next) => {
  const data = await Connection.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  data.forEach(dt => {
    Object.assign(dt, {
      style: getConnectionStyle(dt),
      connections: parseConnecitons(dt.details),
    });
  })


  res.render('index', { data, pageName: 'connections' });
});

router.post('/remove', async (req, res, next) => {
  try {
    const { blockchain, hostname, nodeIds } = req.body;
    const data = await Hand.findOne({
      where: {
        mode: { [Op.in]: ['fullnode', 'farmer', 'standard_wallet'] },
        blockchain,
        hostname
      }
    });

    if (data) {
      const finalUrl = `${data.url}/connectionsWorker/remove`;
      await axios.post(finalUrl, { nodeIds }, { headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
        logger.error('connectionsWorker/remove', finalUrl);
      });
      return res.json({ status: 'success' });
    }
  } catch (e) {
    logger.error('remove-connection', e);
  }

  return res.json({ status: 'failed' });
});

router.post('/add', async (req, res, next) => {
  try {
    const { blockchain, hostname, connections } = req.body;
    const data = await Hand.findOne({
      where: {
        mode: { [Op.in]: ['fullnode', 'farmer', 'standard_wallet'] },
        blockchain,
        hostname
      }
    });

    if (data) {
      const finalUrl = `${data.url}/connectionsWorker/add`;
      axios.post(finalUrl, { connections }, { headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
        logger.error('connectionsWorker/add', finalUrl);
      });
      return res.json({ status: 'success' });
    }

  } catch (e) {
    logger.error('add-connection', e);
  }

  return res.json({ status: 'failed' });
});

module.exports = router;
