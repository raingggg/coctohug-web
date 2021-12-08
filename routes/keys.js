var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Key } = require('../models');
const chainConfigs = require('../utils/chainConfigs');
const { getWalletAddress } = require('../utils/blockUtil');

router.get('/', async (req, res, next) => {
  const data = await Key.findAll({
    order: [
      ['blockchain', 'ASC'],
    ]
  });

  data.forEach(dt => {
    const exp = chainConfigs[dt.blockchain] ? chainConfigs[dt.blockchain].exp : chainConfigs.default.exp;
    const firstWallet = getWalletAddress(dt.details);
    Object.assign(dt, {
      firstWallet: `${exp}${firstWallet}`,
    });
  })

  res.render('index', { data, pageName: 'keys' });
});

module.exports = router;
