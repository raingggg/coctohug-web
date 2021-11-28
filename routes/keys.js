var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Key } = require('../models');

router.get('/', async (req, res, next) => {
  const data = await Key.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  
  res.render('index', {data, pageName: 'keys' });
});

module.exports = router;
