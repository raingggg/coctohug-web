const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { Farm } = require('../models');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-farm-update', payload);
    Farm.upsert(payload);
  } catch (e) {
    logger.error(e);
  }
});

module.exports = router;
