var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Wallet, Hand, AppConfig } = require('../models');
const { logger } = require('../utils/logger');
const { saveMNC } = require('../utils/chiaClient');
const { chainConfigs } = require('../utils/chainConfigs');
const { getWorkerToken, getIp, isFullnodeMode } = require('../utils/chiaConfig');

const isFullnode = isFullnodeMode();
const UNSYNC_THRESHHOLD = 10 * 60 * 1000; // 10 mins
router.get('/', async (req, res, next) => {
  let data = [];
  try {
    data = await Wallet.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    const now = new Date().getTime();
    data.forEach(dt => {
      const lastReview = new Date(dt.updatedAt).getTime();
      const exp = chainConfigs[dt.blockchain] ? chainConfigs[dt.blockchain].exp : chainConfigs.default.exp;
      Object.assign(dt, {
        status: (now - lastReview > UNSYNC_THRESHHOLD) ? 'SyncError' : 'Normal',
        coldWallet: `${exp}${dt.coldWallet}`,
      });
    })
  } catch (e) {
    logger.error('walletsWeb', e);
  }

  res.render('index', { data, pageName: 'wallets' });
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
    logger.error('importNew', e);
  }

  return res.redirect('/reviewWeb');
});

router.get('/generateNew', async (req, res, next) => {
  try {
    const data = await Hand.findAll({
      where: {
        mode: { [Op.in]: ['fullnode', 'wallet'] },
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

    if (gResult) {
      await addKeyNRestart(data);
      return res.json({ status: 'success' });
    }
  } catch (e) {
    logger.error('generateNew', e);
  }

  return res.json({ status: 'failed' });
});

router.post('/transferCoin', async (req, res, next) => {
  try {
    const { blockchain, hostname, toAddress, amount, password } = req.body;
    const data = await AppConfig.findOne({
      where: { key: 'password' }
    });

    if (data && data.value === password) {
      const hand = await Hand.findOne({
        where: {
          mode: { [Op.in]: ['fullnode', 'wallet'] },
          blockchain,
          hostname,
        }
      });

      if (hand && hand.url) {
        const finalUrl = `${hand.url}/walletsWorker/transfer`;
        logger.error('transferCoin', [blockchain, toAddress, amount, getIp(req)]);
        await axios.post(finalUrl, { toAddress, amount }, { headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
          logger.error('walletsWorker/transfer', error);
        });
        return res.json({ status: 'success' });
      }
    } else {
      return res.json({ status: 'incorrect_old_password' });
    }
  } catch (e) {
    logger.error('transferCoin', e);
  }

  return res.json({ status: 'failed' });
});

const genKey = async (hand) => {
  let gResult = false;

  if (hand) {
    try {
      let finalUrl = `${hand.url}/blockchainsWorker/generatekey`;
      let apiRes = await axios.get(finalUrl, { headers: { 'tk': getWorkerToken(hand.hostname, hand.blockchain) } }).catch(function (error) {
        logger.error('blockchainsWorker/generatekey', error);
      });
      if (apiRes && apiRes.data && apiRes.data.status === 'OK') {
        gResult = true;
      }
    } catch (ex) {
      logger.error('genKey', ex);
    }
  }

  return gResult;
}

const addKeyNRestart = async (data) => {
  for (let i = 0; i < data.length; i++) {
    try {
      const hand = data[i];
      let finalUrl = `${hand.url}/blockchainsWorker/addkey`;
      await axios.get(finalUrl, { headers: { 'tk': getWorkerToken(hand.hostname, hand.blockchain) } }).catch(function (error) {
        logger.error('blockchainsWorker/addkey', error);
      });

      if (isFullnode) {
        finalUrl = `${hand.url}/blockchainsWorker/restart`;
        await axios.get(finalUrl, { headers: { 'tk': getWorkerToken(hand.hostname, hand.blockchain) } }).catch(function (error) {
          logger.error('blockchainsWorker/restart', error);
        });
      }
    } catch (ex) {
      logger.error('addKeyNRestart', ex);
    }
  }
};


module.exports = router;
