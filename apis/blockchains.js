const express = require('express');
const router = express.Router();
const { Blockchain } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-blockchain-update', payload);
    Blockchain.upsert(payload);
  } catch (e) {
    logger.error('api-blockchain-update', e);
  }
  return res.json({ status: 'success' });
});


module.exports = router;
