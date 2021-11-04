var i18n = require('i18n'); // require('i18n')
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'home' });
});

module.exports = router;
