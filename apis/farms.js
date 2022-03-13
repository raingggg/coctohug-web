const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { Farm, FarmDetail } = require('../models');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-farm-update', payload);
    Farm.upsert(payload);
    FarmDetail.upsert(payload);
  } catch (e) {
    logger.error('api-farm-update', e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
