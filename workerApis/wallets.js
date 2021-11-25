const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const {
  transferCoin,
} = require('../utils/chiaClient');


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
