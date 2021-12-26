const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { Hand } = require('../models');
const { setWorkerToken } = require('../utils/chiaConfig');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    setWorkerToken(payload.hostname, payload.blockchain, req.header('tk'));
    logger.debug('api-hand-update', payload);
    Hand.upsert(payload);
  } catch (e) {
    logger.error('api-hand-update', e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
