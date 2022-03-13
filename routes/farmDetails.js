var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { FarmDetail } = require('../models');
const { getFarmDetailStyle } = require('../utils/blockUtil');

router.get('/', async (req, res, next) => {
  const data = await FarmDetail.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  data.forEach(dt => {
    Object.assign(dt, {
      style: getFarmDetailStyle(dt),
    });
  })

  res.render('index', { data, pageName: 'blockchains' });
});

module.exports = router;
