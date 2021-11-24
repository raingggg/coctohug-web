const express = require('express');
const router = express.Router();
const { hasMNCFile, blockchainConfig: { mncPath } } = require('../utils/chiaConfig');
const { AppConfig } = require('../models');

router.get('/', async (req, res, next) => {
  const data = await AppConfig.findOne({
    where: { key: 'password' }
  });

  if (!data) return res.redirect('/settingsWeb/createPasswordWeb');

  const shouldRedirect = await hasMNCFile();
  if (shouldRedirect) {
    return res.redirect('/reviewWeb');
  } else {
    return res.render('index', { title: req.__('Welcome to Express'), pageName: 'home', mncPath });
  }
});

module.exports = router;
