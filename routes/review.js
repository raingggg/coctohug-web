var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Farm } = require('../models');
const { isWebControllerMode } = require('../utils/chiaConfig');
const isWebController = isWebControllerMode();

router.get('/', async (req, res, next) => {
  if (isWebController) {
    const data = await Farm.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });
    res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'review' });
  } else {
    res.render('index', { title: req.__('Welcome to Express'), pageName: 'api' });
  }
});

module.exports = router;
