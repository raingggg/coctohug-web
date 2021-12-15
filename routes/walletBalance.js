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
      if (dt.total_price) {
        allCoinsDollars += dt.total_price;
      }
    });
  } catch (e) {
    logger.error('walletBalanceWeb', e);
  }

  res.render('index', { data, allCoinsDollars, pageName: 'walletBalance' });
});

router.post('/remove', async (req, res, next) => {
  try {
    const { balances } = req.body;
    for (let i = 0; i < balances.length; i++) {
      try {
        const { blockchain, address } = balances[i];
        await WalletBalance.destroy({ where: { blockchain, address } });
      } catch (ex) {
        logger.error('remove-walletBalance-one', ex);
      }
    }

    return res.json({ status: 'success' });
  } catch (e) {
    logger.error('remove-walletBalance', e);
  }

  return res.json({ status: 'failed' });
});

router.post('/add', async (req, res, next) => {
  try {
    const { blockchain, address } = req.body;
    await WalletBalance.upsert({ blockchain, address });

    return res.json({ status: 'success' });
  } catch (e) {
    logger.error('add-connection', e);
  }

  return res.json({ status: 'failed' });
});

module.exports = router;
