var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send(res.__('no users'));
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'summary' });
});

module.exports = router;
