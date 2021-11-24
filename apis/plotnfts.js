const express = require('express');
const router = express.Router();
const { Plotnft } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug(payload);
    Plotnft.upsert(payload);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
