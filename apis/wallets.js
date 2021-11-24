const express = require('express');
const router = express.Router();
const { Wallet } = require('../models');
const { logger } = require('../utils/logger');
const {
  transferCoin,
} = require('../utils/chiaClient');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-wallet-update', payload);
    Wallet.upsert(payload);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: "success" });
});

router.post('/transfer', async (req, res, next) => {
  try {
    const { toAddress, amount } = req.body;
    logger.debug('api-wallet-transfer', [toAddress, amount]);
    await transferCoin(toAddress, amount);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
