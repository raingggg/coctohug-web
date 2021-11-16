const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { logger } = require('../utils/logger');

router.get('/add', function (req, res, next) {
  try {
    const payload = req.body;
    logger.debug('api-news-create', payload);
    News.create(payload);
  } catch (e) {
    logger.error(e);
  }
});

module.exports = router;
