const express = require('express');
const router = express.Router();
const { Key, WalletBalance } = require('../models');
const { logger } = require('../utils/logger');
const { getWalletAddress } = require('../utils/blockUtil');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-key-update', payload);
    await Key.upsert(payload);
    if (payload && payload.details) {
      const firstWalletAdress = getWalletAddress(payload.details);
      if (firstWalletAdress) {
        await WalletBalance.upsert({ blockchain: payload.blockchain, address: firstWalletAdress });
      }
    }
  } catch (e) {
    logger.error('api-key-update', e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
