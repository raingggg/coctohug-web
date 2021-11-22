const express = require('express');
const router = express.Router();
const { hasMNCFile, blockchainConfig: { mncPath } } = require('../utils/chiaConfig');

router.get('/', async (req, res, next) => {
  const shouldRedirect = await hasMNCFile();
  if (shouldRedirect) {
    res.redirect('/reviewWeb');
  } else {
    res.render('index', { title: req.__('Welcome to Express'), pageName: 'home', mncPath });
  }
});

module.exports = router;
