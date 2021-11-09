const express = require('express');
const router = express.Router();
const { Key } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', function (req, res, next) {
  try {
    const payload = req.body;
    logger.debug(payload);
    Key.upsert(payload);
  } catch (e) {
    logger.error(e);
  }
});

module.exports = router;
