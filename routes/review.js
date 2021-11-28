var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Farm, Wallet } = require('../models');
const { isWebControllerMode } = require('../utils/chiaConfig');
const { getTotalBalance } = require('../utils/blockUtil');
const isWebController = isWebControllerMode();

const UNSYNC_THRESHHOLD = 10 * 60 * 1000; // 10 mins
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

      const wd = walletData.find(w => w.blockchain === dt.blockchain);
      if (wd) {
        const balance = getTotalBalance(wd.details);
        Object.assign(dt, { balance });
      }
    })

    res.render('index', {data, pageName: 'review' });
  } else {
    res.render('index', { pageName: 'api' });
  }
});

module.exports = router;
