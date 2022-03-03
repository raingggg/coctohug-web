var i18n = require('i18n');
const express = require('express');
const router = express.Router();
const { WeeklyReport } = require('../models');
const { Op } = require("sequelize");

router.get('/', async (req, res, next) => {
  const data = await WeeklyReport.findAll({
    order: [
      ['updatedAt', 'DESC'],
    ],
    limit: 500,
  });


  res.render('index', { data, pageName: 'weeklyReport' });
});

module.exports = router;
