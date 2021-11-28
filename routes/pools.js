var i18n = require('i18n');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res, next) => {
  res.render('index', { pageName: 'pools' });
});

module.exports = router;
