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
        [Op.in]: ['EVT_INTIME_RECEIVE_COIN'] // 'EVT_INTIME_BLOCK_FOUND',
      }
    },
    limit: 200,
  });
  res.render('index', { data, pageName: 'receivedCoins' });
});

module.exports = router;
