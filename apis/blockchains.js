const express = require('express');
const router = express.Router();
const { Blockchain } = require('../models');
const { logger } = require('../utils/logger');
const { restartBlockchain } = require('../utils/chiaClient');
const { blockchainConfig: { blockchain } } = require('../utils/chiaConfig');

router.post('/update', function (req, res, next) {
  try {
    const payload = req.body;
    logger.debug('api-blockchain-update', payload);
    Blockchain.upsert(payload);
  } catch (e) {
    logger.error(e);
  }
});

router.get('/restart', async (req, res, next) => {
  const data = {};

  try {
    logger.debug('api-blockchain-restart');
    const result = await restartBlockchain();
    data[`${blockchain}`] = result;
  } catch (e) {
    logger.error('restart', e);
    data[`${blockchain}`] = e;
  }

  res.json(data);
});

module.exports = router;
