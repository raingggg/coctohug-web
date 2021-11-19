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
      type: {
        [Op.in]: ['EVT_INTIME_BLOCK_FOUND', 'EVT_INTIME_RECEIVE_COIN']
      }
    },
    limit: 100,
  });
  res.render('index', { title: req.__('Welcome to Express'), data, pageName: 'receivedCoins' });
});

module.exports = router;
