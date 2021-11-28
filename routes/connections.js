var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Connection, Hand } = require('../models');
const { parseConnecitons } = require('../utils/chiaParser');
const { getWorkerToken } = require('../utils/chiaConfig');

const UNSYNC_THRESHHOLD = 10 * 60 * 1000; // 10 mins
router.get('/', async (req, res, next) => {
  const data = await Connection.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  const now = new Date().getTime();
  data.forEach(dt => {
    const lastReview = new Date(dt.updatedAt).getTime();
    Object.assign(dt, {
      status: (now - lastReview > UNSYNC_THRESHHOLD) ? 'SyncError' : 'Normal',
      connections: parseConnecitons(dt.details),
    });
  })


  res.render('index', {data, pageName: 'connections' });
});

router.post('/remove', async (req, res, next) => {
  try {
    const { blockchain, hostname, nodeIds } = req.body;
    const data = await Hand.findOne({
      where: {
        mode: 'fullnode',
        blockchain,
        hostname
      }
    });

    if (data) {
      const finalUrl = `${data.url}/connectionsWorker/remove`;
      await axios.post(finalUrl, { nodeIds }, { headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
        logger.error(error);
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
    const { blockchain, hostname, connection } = req.body;
    const data = await Hand.findOne({
      where: {
        mode: 'fullnode',
        blockchain,
        hostname
      }
    });

    if (data) {
      const finalUrl = `${data.url}/connectionsWorker/add`;
      await axios.post(finalUrl, { connection }, { headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
        logger.error(error);
      });
      return res.json({ status: 'success' });
    }

  } catch (e) {
    logger.error('add-connection', e);
  }

  return res.json({ status: 'failed' });
});

module.exports = router;
