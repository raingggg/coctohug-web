const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  // res.send(res.__('no users'));
  res.render('index', { title: req.__('Welcome to Express'), pageName: 'summary' });
});

module.exports = router;
