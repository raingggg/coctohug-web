const { zip } = require('zip-a-folder');
const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { blockchainConfig } = require('../utils/chiaConfig');
const { isValidAccessToken, getIp, setWorkerToken, getWorkerToken } = require('../utils/chiaConfig');

const CERTIFICATE_OPEN_TIME = 1000 * 60 * 120; // 2 hours
router.get('/', async (req, res, next) => {
  try {
    const tokenTime = getWorkerToken('allow', 'harvester');
    const canDownload = (new Date().getTime() - parseInt(tokenTime)) < CERTIFICATE_OPEN_TIME;
    if (canDownload) {
      const zipFileName = '/tmp/certs.zip';
      await zip(blockchainConfig.certificates, zipFileName);
      return res.download(zipFileName, `certs.zip`);
    }
  } catch (e) {
    logger.error('certificatesweb', e);
  }

  return res.json({ status: "failed" });
});

router.get('/allowHarvester', async (req, res, next) => {
  if (!isValidAccessToken(req.header('tk'))) {
    logger.error('invalid access - allowHarvester: ', getIp(req));
    return res.json({ status: 'invalid token' });
  }

  setWorkerToken('allow', 'harvester', new Date().getTime());
  return res.json({ status: "success" });
});

module.exports = router;
