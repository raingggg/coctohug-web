const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

router.get('/', function (req, res, next) {
  res.json({ status: "OOKK" });
});

module.exports = router;
