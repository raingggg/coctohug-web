const express = require('express');
const router = express.Router();
const { Plotnft } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', function (req, res, next) {
  try {
    const payload = req.body;
    logger.info(payload);
    Plotnft.upsert(payload);
  } catch (e) {
    logger.error(e);
  }
});

module.exports = router;
