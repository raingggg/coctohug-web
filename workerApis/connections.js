const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { addConnection, removeConnection, } = require('../utils/chiaClient');

router.post('/remove', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-connection-remove', payload);
    await removeConnection(payload.nodeIds);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: "success" });
});

router.post('/add', async (req, res, next) => {
  try {
    const payload = req.body;
    logger.debug('api-connection-add', payload);
    await addConnection(payload.connection);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
