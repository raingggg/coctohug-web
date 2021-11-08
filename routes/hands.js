var i18n = require('i18n');
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'hands' });
});

module.exports = router;
