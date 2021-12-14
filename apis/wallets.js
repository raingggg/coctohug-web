const express = require('express');
const router = express.Router();
const { Wallet, WalletBalance } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-wallet-update', payload);
    await Wallet.upsert(payload);
    if (payload.coldWallet) {
      await WalletBalance.upsert({ blockchain: payload.blockchain, address: payload.coldWallet });
    }
  } catch (e) {
    logger.error('api-wallet-update', e);
  }

  return res.json({ status: "success" });
});


module.exports = router;
