var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Farm } = require('../models');

router.get('/', async (req, res, next) => {
  const data = await Farm.findAll();
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'review' });
});

module.exports = router;
