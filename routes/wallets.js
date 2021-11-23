var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Wallet, Hand } = require('../models');
const { logger } = require('../utils/logger');
const { saveMNC } = require('../utils/chiaClient');

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
  try {
    const { mnemonic } = req.body;
    await saveMNC(mnemonic);

    const data = await Hand.findAll({
      where: {
        mode: 'fullnode'
      }
    });

    await addKeyNRestart(data);
  } catch (e) {
    logger.error(e);
  }

  res.redirect('/reviewWeb');
});

router.post('/generateNew', async (req, res, next) => {
  try {
    const data = await Hand.findAll({
      where: {
        mode: 'fullnode'
      }
    });

    const chia = data.find(d => d.blockchain === 'chia');
    const flora = data.find(d => d.blockchain === 'flora');
    let gResult = false;
    if (chia) gResult = await genKey(chia);
    else if (flora) gResult = await genKey(flora);
    if (!gResult) {
      const other = data.find(d => !['chia', 'flora'].includes(d.blockchain));
      if (other) gResult = await genKey(other);
    }

    if (gResult) await addKeyNRestart(data);
  } catch (e) {
    logger.error(e);
  }

  res.redirect('/reviewWeb');
});

const genKey = async (hand) => {
  let gResult = false;

  if (hand) {
    try {
      let finalUrl = `${hand.url}/blockchains/generatekey`;
      let apiRes = await axios.get(finalUrl);
      if (apiRes && apiRes.data && apiRes.data.status === 'OK') {
        gResult = true;
      }
    } catch (ex) {
      logger.error(ex);
    }
  }

  return gResult;
}

const addKeyNRestart = async (data) => {
  for (let i = 0; i < data.length; i++) {
    try {
      let finalUrl = `${data[i].url}/blockchains/addkey`;
      await axios.get(finalUrl);

      finalUrl = `${data[i].url}/blockchains/restart`;
      await axios.get(finalUrl);
    } catch (ex) {
      logger.error(ex);
    }
  }
};


module.exports = router;
