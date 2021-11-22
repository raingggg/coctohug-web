var i18n = require('i18n');
const express = require('express');
const router = express.Router();


router.get('/restart', function (req, res, next) {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'restart' });
});

router.get('/coldWallet', function (req, res, next) {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'coldWallet' });
});

router.get('/resetPassword', function (req, res, next) {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'resetPassword' });
});

module.exports = router;
