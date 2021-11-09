var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Blockchain } = require('../models');

router.get('/', async (req, res, next) => {
  const data = await Blockchain.findAll();
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'blockchains' });
});

module.exports = router;
