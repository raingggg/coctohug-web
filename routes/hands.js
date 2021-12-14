var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const {
  Blockchain,
  Connection,
  Farm,
  Hand,
  Key,
  News,
  Wallet,
} = require('../models');

router.get('/', async (req, res, next) => {
  const data = await Hand.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  res.render('index', { data, pageName: 'hands' });
});

router.post('/remove', async (req, res, next) => {
  try {
    const { hands } = req.body;

    for (let i = 0; i < hands.length; i++) {
      try {
        const { blockchain, hostname } = hands[i];
        await Blockchain.destroy({ where: { blockchain, hostname } });
        await Connection.destroy({ where: { blockchain, hostname } });
        await Farm.destroy({ where: { blockchain, hostname } });
        await Hand.destroy({ where: { blockchain, hostname } });
        await Key.destroy({ where: { blockchain, hostname } });
        await News.destroy({ where: { blockchain, hostname } });
        await Wallet.destroy({ where: { blockchain, hostname } });
      } catch (ex) {
        logger.error('remove-one-hand', ex);
      }
    }

    return res.json({ status: 'success' });
  } catch (e) {
    logger.error('remove-hand', e);
  }

  return res.json({ status: 'failed' });
});

module.exports = router;
