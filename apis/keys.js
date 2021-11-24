const express = require('express');
const router = express.Router();
const { Key } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-key-update', payload);
    Key.upsert(payload);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
