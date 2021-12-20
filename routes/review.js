var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Farm, Wallet } = require('../models');
const { isWebControllerMode } = require('../utils/chiaConfig');
const { getTotalBalance } = require('../utils/blockUtil');
const isWebController = isWebControllerMode();

const UNSYNC_THRESHHOLD = 30 * 60 * 1000; // 30 mins
router.get('/', async (req, res, next) => {
  if (isWebController) {
    const data = await Farm.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    const walletData = await Wallet.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    const now = new Date().getTime();
    data.forEach(dt => {
      const lastReview = new Date(dt.updatedAt).getTime();
      if (now - lastReview > UNSYNC_THRESHHOLD) {
        Object.assign(dt, { status: 'Sync Error' });
      }

      let total_coins = dt.total_coins;
      if (total_coins > 0) total_coins = parseFloat(total_coins.toFixed(6));
      Object.assign(dt, { total_coins });

      const wd = walletData.find(w => w.blockchain === dt.blockchain);
      if (wd) {
        let balance = getTotalBalance(wd.details);
        if (balance > 0) balance = parseFloat(balance.toFixed(6));
        Object.assign(dt, { balance });
      }
    })

    res.render('index', { data, pageName: 'review' });
  } else {
    res.render('index', { pageName: 'api' });
  }
});

module.exports = router;
