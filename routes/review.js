var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { Farm } = require('../models');
const { isWebControllerMode } = require('../utils/chiaConfig');
const isWebController = isWebControllerMode();

const UNSYNC_THRESHHOLD = 10 * 60 * 1000; // 10 mins
router.get('/', async (req, res, next) => {
  if (isWebController) {
    const data = await Farm.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    const now = new Date().getTime();
    data.forEach(dt => {
      const lastReview = new Date(dt.updatedAt).getTime();
      if (now - lastReview > UNSYNC_THRESHHOLD) {
        Object.assign(dt, { status: 'Sync Error' });
      }
    })

    res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'review' });
  } else {
    res.render('index', { title: req.__('Welcome to Express'), pageName: 'api' });
  }
});

module.exports = router;
