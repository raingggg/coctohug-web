const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { logger } = require('../utils/logger');

router.post('/add', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-news-create', payload);
    News.create(payload);
  } catch (e) {
    logger.error('api-news-create', e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
