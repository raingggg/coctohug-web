const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

router.get('/', async (req, res, next) => {
  return res.json({ status: "OOKK" });
});

module.exports = router;
