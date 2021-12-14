var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { Op } = require("sequelize");

router.get('/', async (req, res, next) => {
  const data = await News.findAll({
    order: [
      ['updatedAt', 'DESC'],
    ],
    where: {
      type: 'EVT_DAILY_ALL_IN_ONE'
    },
    limit: 200,
  });


  res.render('index', { data, pageName: 'dailyReport' });
});

module.exports = router;
