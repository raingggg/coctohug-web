const express = require('express');
const router = express.Router();
const { Blockchain } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', function (req, res, next) {
  try {
    const payload = req.body;
    logger.info(payload);
    Blockchain.upsert(payload);
  } catch (e) {
    logger.error(e);
  }
});

module.exports = router;
