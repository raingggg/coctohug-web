const express = require('express');
const router = express.Router();
const { Blockchain } = require('../models');
const { logger } = require('../utils/logger');
const { restartBlockchain, addKeyBlockchain, generateKeyBlockchain } = require('../utils/chiaClient');
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

router.get('/addkey', async (req, res, next) => {
  const data = {};

  try {
    logger.debug('api-blockchain-addkey');
    const result = await addKeyBlockchain();
    data[`${blockchain}`] = result;
  } catch (e) {
    logger.error('restart', e);
    data[`${blockchain}`] = e;
  }

  res.json(data);
});

router.get('/generatekey', async (req, res, next) => {
  const data = {};

  try {
    logger.debug('api-blockchain-generatekey');
    const result = await generateKeyBlockchain();
    data.status = 'OK';
  } catch (e) {
    logger.error('restart', e);
    data.status = 'Failed';
  }

  res.json(data);
});

module.exports = router;
