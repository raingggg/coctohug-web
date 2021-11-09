var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Key } = require('../models');

router.get('/', async (req, res, next) => {
  const data = await Key.findAll();
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'keys' });
});

module.exports = router;
