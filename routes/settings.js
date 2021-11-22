var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Hand } = require('../models');
const { logger } = require('../utils/logger');

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

router.get('/coldWalletWeb', function (req, res, next) {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'coldWallet' });
});

router.get('/resetPasswordWeb', function (req, res, next) {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'resetPassword' });
});

module.exports = router;
