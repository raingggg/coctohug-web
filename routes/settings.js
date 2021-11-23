var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const { writeFile } = require('fs/promises');
const router = express.Router();
const { Hand, Key } = require('../models');
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
    res.json(apiRes.data);
  } catch (e) {
    logger.error(e);
    res.json({ result: 'failed' });
  }
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
    res.download(coldWalletFile, `${new Date().toISOString().substring(0,10)}-coldwallet.json`);
  } catch (e) {
    logger.error(e);
    res.json({ result: 'failed' });
  }
});

router.get('/resetPasswordWeb', async (req, res, next) => {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'resetPassword' });
});

module.exports = router;
