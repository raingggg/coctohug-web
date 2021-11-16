var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { Op } = require("sequelize");

router.get('/', async (req, res, next) => {
  const data = await News.findAll({
    order: [
      ['unique_id', 'DESC'],
    ],
    where: {
      type: {
        [Op.like]: 'EVT_DAILY_%'
      }
    },
    limit: 100,
  });
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'dailyReport' });
});

module.exports = router;
