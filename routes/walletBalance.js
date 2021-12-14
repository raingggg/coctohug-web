var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { WalletBalance } = require('../models');

router.get('/', async (req, res, next) => {
  let allCoinsDollars = 0;
  let data = [];

  try {
    data = await WalletBalance.findAll({
      order: [
        ['price', 'DESC'],
      ]
    });

    data.forEach(dt => {
      allCoinsDollars += dt.total_price;
    });
  } catch (e) {
    logger.error('walletBalanceWeb', e);
  }

  res.render('index', { data, allCoinsDollars, pageName: 'walletBalance' });
});

module.exports = router;
