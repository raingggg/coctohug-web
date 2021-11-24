var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const { writeFile } = require('fs/promises');
const router = express.Router();
const { Hand, Key, AppConfig } = require('../models');
const { logger } = require('../utils/logger');
const { getWalletAddress } = require('../utils/blockUtil');
const { blockchainConfig: { coldWalletFile } } = require('../utils/chiaConfig');

router.get('/restartWeb', async (req, res, next) => {
  const data = await Hand.findAll({
    where: {
      mode: 'fullnode'
    },
    order: [
      ['blockchain', 'ASC'],
    ]
  });
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'restart' });
});

router.get('/restartOp', async (req, res, next) => {
  try {
    const { hostname, blockchain } = req.query;
    const data = await Hand.findAll({
      where: {
        mode: 'fullnode',
        hostname,
        blockchain
      }
    });

    const url = data && data[0] && data[0].url;
    const finalUrl = `${url}/blockchains/restart`;
    const apiRes = await axios.get(finalUrl);
    return res.json(apiRes.data);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ result: 'failed' });
});

router.get('/coldWalletWeb', async (req, res, next) => {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'coldWallet' });
});

router.get('/coldWalletExport', async (req, res, next) => {
  try {
    const obj = {};
    const data = await Key.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    data.forEach(dt => {
      const wa = getWalletAddress(dt.details);
      obj[dt.blockchain] = wa;
    });

    await writeFile(coldWalletFile, JSON.stringify(obj, null, 4));
    return res.download(coldWalletFile, `${new Date().toISOString().substring(0, 10)}-coldwallet.json`);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ result: 'failed' });
});

router.post('/coldWalletImport', async (req, res, next) => {
  try {
    let result = {};
    const { wallets } = req.body;

    const data = await Hand.findAll({
      where: {
        mode: 'fullnode'
      }
    });

    for (let i = 0; i < data.length; i++) {
      try {
        const { url, blockchain } = data[i];
        if (url && wallets[blockchain]) {
          const finalUrl = `${url}/blockchains/savecoldwallet`;
          const apiRes = await axios.post(finalUrl, { coldWalletAddress: wallets[blockchain] }).catch(function (error) {
            logger.error(error);
          });
          result[blockchain] = apiRes.data;
        }
      } catch (ex) {
        logger.error(ex);
      }
    }

    return res.json(result);
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: 'failed' });
});

router.get('/createPasswordWeb', async (req, res, next) => {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'createPassword' });
});

router.post('/createPasswordOp', async (req, res, next) => {
  try {
    const { password } = req.body;
    logger.debug('createPasswordOp');
    const data = await AppConfig.findOne({
      where: { key: 'password' }
    });

    if (!data) {
      await AppConfig.upsert({ key: 'password', value: password });
      return res.json({ status: 'success' });
    }
  } catch (e) {
    logger.error(e);
  }

  return res.json({ status: 'failed' });
});

router.get('/resetPasswordWeb', async (req, res, next) => {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'resetPassword' });
});


module.exports = router;
