var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Hand } = require('../models');

router.get('/', async (req, res, next) => {
  const data = await Hand.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'hands' });
});

module.exports = router;
