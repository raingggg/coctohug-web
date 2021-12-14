const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { addConnection, removeConnection } = require('../utils/chiaClient');
const { isValidAccessToken, getIp } = require('../utils/chiaConfig');

router.post('/remove', async (req, res, next) => {
  if (!isValidAccessToken(req.header('tk'))) {
    logger.error('invalid access - connection remove: ', getIp(req));
    return res.json({ status: 'invalid token' });
  }

  try {
    const payload = req.body;
    logger.debug('api-connection-remove', payload);
    await removeConnection(payload.nodeIds);
  } catch (e) {
    logger.error('api-connection-remove', e);
  }

  return res.json({ status: "success" });
});

router.post('/add', async (req, res, next) => {
  if (!isValidAccessToken(req.header('tk'))) {
    logger.error('invalid access - connection add: ', getIp(req));
    return res.json({ status: 'invalid token' });
  }

  try {
    const payload = req.body;
    logger.debug('api-connection-add', payload);
    await addConnection(payload.connection);
  } catch (e) {
    logger.error('api-connection-add', e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
