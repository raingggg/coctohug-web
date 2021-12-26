const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { Hand, AllInOne } = require('../models');
const { setWorkerToken } = require('../utils/chiaConfig');

router.post('/update', async (req, res, next) => {
  try {
    const payload = req.body;
    setWorkerToken(payload.hostname, payload.blockchain, req.header('tk'));
    logger.debug('api-hand-update', payload);
    await Hand.upsert(payload);
    await AllInOne.upsert({
      hostname: payload.hostname,
      blockchain: payload.blockchain,
      ext_num_1: payload.protocol_port,
      ext_str_1: payload.fork_version,
    })
  } catch (e) {
    logger.error('api-hand-update', e);
  }

  return res.json({ status: "success" });
});

module.exports = router;
