const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  res.send('no users');
  // res.render('index', { pageName: 'summary' });
});

module.exports = router;
