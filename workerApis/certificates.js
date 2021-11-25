const { zip } = require('zip-a-folder');
const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { blockchainConfig } = require('../utils/chiaConfig');

router.get('/', async (req, res, next) => {
  try {
    const zipFileName = '/tmp/certs.zip';
    await zip(blockchainConfig.certificates, zipFileName);
    return res.download(zipFileName, `certs.zip`);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: "failed" });
});

module.exports = router;
