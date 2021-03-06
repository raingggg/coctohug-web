const express = require('express');
const router = express.Router();
const { Connection } = require('../models');
const { logger } = require('../utils/logger');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-connection-update', payload);
    Connection.upsert(payload);
  } catch (e) {
    logger.error('api-connection-update', e);
  }

  return res.json({ status: "success" });
});


module.exports = router;
