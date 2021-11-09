var i18n = require('i18n');
const express = require('express');
const router = express.Router();

const { Connection } = require('../models');
router.get('/', async (req, res, next) => {
  const data = await Connection.findAll();
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'connections' });
});

module.exports = router;
