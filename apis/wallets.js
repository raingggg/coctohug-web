const express = require('express');
const router = express.Router();
const { Wallet } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-wallet-update', payload);
    Wallet.upsert(payload);
  } catch (e) {
    logger.error('api-wallet-update', e);
  }

  return res.json({ status: "success" });
});


module.exports = router;
