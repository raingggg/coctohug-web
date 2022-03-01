var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Blockchain } = require('../models');
const { getBlockchainStyle } = require('../utils/blockUtil');

router.get('/', async (req, res, next) => {
  const data = await Blockchain.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  data.forEach(dt => {
    Object.assign(dt, {
      style: getBlockchainStyle(dt),
    });
  })

  res.render('index', { data, pageName: 'blockchains' });
});

module.exports = router;
