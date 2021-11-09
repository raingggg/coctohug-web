var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Wallet } = require('../models');

router.get('/', async (req, res, next) => {
  const data = await Wallet.findAll();
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'wallets' });
});

module.exports = router;
