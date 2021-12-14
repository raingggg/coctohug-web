var i18n = require('i18n');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { News } = require('../models');
const { Op } = require("sequelize");
const { logger } = require('../utils/logger');

router.get('/', async (req, res, next) => {
  let data = [];
  let latestNews = '';

  try {
    data = await News.findAll({
      order: [
        ['updatedAt', 'DESC'],
      ],
      where: {
        [Op.not]: [
          { type: ['EVT_INTIME_BLOCK_FOUND', 'EVT_INTIME_RECEIVE_COIN', 'EVT_DAILY_ALL_IN_ONE'] }
        ]
      },
      limit: 500,
    });

    const finalUrl = `https://www.coctohug.xyz/latestNews?locale=${req.cookies.language || 'en'}`;
    const apiRes = await axios.get(finalUrl).catch(function (error) {
      logger.error('xyz/latestNews', error);
    });
    latestNews = apiRes.data;
  } catch (e) {
    logger.error('latestNews', e);
  }

  res.render('index', { data, latestNews, pageName: 'news' });
});

module.exports = router;
