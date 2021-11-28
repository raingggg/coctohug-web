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
      [Op.not]: [
        { type: ['EVT_INTIME_BLOCK_FOUND', 'EVT_INTIME_RECEIVE_COIN', 'EVT_DAILY_ALL_IN_ONE'] }
      ]
    },
    limit: 100,
  });

  
  res.render('index', {data, pageName: 'news' });
});

module.exports = router;
