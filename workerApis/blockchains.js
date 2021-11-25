const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const {
  restartBlockchain,
  addKeyBlockchain,
  generateKeyBlockchain,
  saveColdWallet,
} = require('../utils/chiaClient');
const { blockchainConfig: { blockchain }, isValidAccessToken, getIp } = require('../utils/chiaConfig');

router.get('/restart', async (req, res, next) => {
  if (!isValidAccessToken(req.header('tk'))) {
    logger.error('invalid access - blockchain restart: ', [getIp(req), req.header('tk')]);
    return res.json({ status: 'invalid token' });
  }
  const data = {};

  try {
    logger.debug('api-blockchain-restart');
    const result = await restartBlockchain();
    data[`${blockchain}`] = result;
  } catch (e) {
    logger.error('restart', e);
    data[`${blockchain}`] = e;
  }

  return res.json(data);
});

router.get('/addkey', async (req, res, next) => {
  if (!isValidAccessToken(req.header('tk'))) {
    logger.error('invalid access - blockchain addkey: ', getIp(req));
    return res.json({ status: 'invalid token' });
  }
  const data = {};

  try {
    logger.debug('api-blockchain-addkey');
    const result = await addKeyBlockchain();
    data[`${blockchain}`] = result;
  } catch (e) {
    logger.error('restart', e);
    data[`${blockchain}`] = e;
  }

  return res.json(data);
});

router.get('/generatekey', async (req, res, next) => {
  if (!isValidAccessToken(req.header('tk'))) {
    logger.error('invalid access - blockchain generatekey: ', getIp(req));
    return res.json({ status: 'invalid token' });
  }
  const data = {};

  try {
    logger.debug('api-blockchain-generatekey');
    const result = await generateKeyBlockchain();
    data.status = 'OK';
  } catch (e) {
    logger.error('restart', e);
    data.status = 'Failed';
  }

  return res.json(data);
});

router.post('/savecoldwallet', async (req, res, next) => {
  if (!isValidAccessToken(req.header('tk'))) {
    logger.error('invalid access - blockchain savecoldwallet: ', getIp(req));
    return res.json({ status: 'invalid token' });
  }
  let result = false;

  try {
    const { coldWalletAddress } = req.body;
    logger.debug('api-blockchain-savecoldwallet', coldWalletAddress);
    result = await saveColdWallet(coldWalletAddress);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ result });
});

module.exports = router;
