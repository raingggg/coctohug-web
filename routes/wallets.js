var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Wallet } = require('../models');

const UNSYNC_THRESHHOLD = 10 * 60 * 1000; // 10 mins
router.get('/', async (req, res, next) => {
  const data = await Wallet.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  const now = new Date().getTime();
  data.forEach(dt => {
    const lastReview = new Date(dt.updatedAt).getTime();
    Object.assign(dt, {
      status: (now - lastReview > UNSYNC_THRESHHOLD) ? 'SyncError' : 'Normal'
    });
  })

  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'wallets' });
});

router.post('/importNew', async (req, res, next) => {
  const { mnemonic } = req.body;
  // update mnc.txt and call all hands to restart
  res.redirect('/reviewWeb');
});

router.post('/generateNew', async (req, res, next) => {
  // generate mnc.txt with the first hand, and call all hands to restart
  res.redirect('/reviewWeb');
});

module.exports = router;
