var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Connection, Hand } = require('../models');
const { parseConnecitons } = require('../utils/chiaParser');

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

  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'connections' });
});

router.post('/remove', async (req, res, next) => {
  const { blockchain, hostname, nodeIds } = req.body;
  const data = await Hand.findOne({
    where: {
      mode: 'fullnode',
      blockchain,
      hostname
    }
  });

  if (data) {
    const finalUrl = `${data.url}/connections/remove`;
    await axios.post(finalUrl, { nodeIds }).catch(function (error) {
      logger.error(error);
    });
  }

  res.json({ status: 'Success' });
});

router.post('/add', async (req, res, next) => {
  const { blockchain, hostname, connection } = req.body;
  const data = await Hand.findOne({
    where: {
      mode: 'fullnode',
      blockchain,
      hostname
    }
  });

  if (data) {
    const finalUrl = `${data.url}/connections/add`;
    await axios.post(finalUrl, { connection }).catch(function (error) {
      logger.error(error);
    });
  }

  res.json({ status: 'Success' });
});

module.exports = router;
