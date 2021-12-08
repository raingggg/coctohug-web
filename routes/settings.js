var i18n = require('i18n');
const path = require('path');
const axios = require('axios');
const express = require('express');
const { Op } = require("sequelize");
const { zip } = require('zip-a-folder');
const { writeFile, mkdir } = require('fs/promises');
const router = express.Router();
const { Hand, Key, AppConfig } = require('../models');
const { logger } = require('../utils/logger');
const { getWalletAddress } = require('../utils/blockUtil');
const { blockchainConfig: { coldWalletFile, downloadsPath }, getWorkerToken } = require('../utils/chiaConfig');

router.get('/restartWeb', async (req, res, next) => {
  const data = await Hand.findAll({
    where: {
      mode: { [Op.in]: ['fullnode', 'wallet'] },
    },
    order: [
      ['blockchain', 'ASC'],
    ]
  });
  res.render('index', { data, pageName: 'restart' });
});

router.get('/restartOp', async (req, res, next) => {
  try {
    const { hostname, blockchain } = req.query;
    const data = await Hand.findAll({
      where: {
        mode: { [Op.in]: ['fullnode', 'wallet'] },
        hostname,
        blockchain
      }
    });

    const url = data && data[0] && data[0].url;
    const finalUrl = `${url}/blockchainsWorker/restart`;
    const apiRes = await axios.get(finalUrl, { timeout: 5000, headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) { logger.error(error); });
    return res.json(apiRes && apiRes.data);
  } catch (e) {
    logger.error('restartOp', e);
  }

  return res.json({ result: 'failed' });
});

router.get('/coldWalletWeb', async (req, res, next) => {
  res.render('index', { pageName: 'coldWallet' });
});

router.get('/downAllWalletConfigs', async (req, res, next) => {
  try {
    const obj = {};
    const data = await Hand.findAll({
      where: {
        mode: { [Op.in]: ['fullnode', 'wallet'] },
      },
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    const tmpPath = new Date().toISOString().replaceAll(':', '-').substring(0, 19);
    const configTmpPath = path.resolve(downloadsPath, tmpPath);
    const configZipFile = path.resolve(downloadsPath, `${tmpPath}.zip`);
    await mkdir(configTmpPath, { recursive: true });
    for (let i = 0; i < data.length; i++) {
      try {
        const { url, hostname, blockchain } = data[i];
        if (url) {
          const finalUrl = `${url}/blockchainsWorker/getConfigFile`;
          const res = await axios.get(finalUrl, { timeout: 5000, headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) { logger.error(error); });
          if (res) {
            const downloadDestination = path.resolve(configTmpPath, `${blockchain}_config.yaml`)
            await writeFile(downloadDestination, res.data.data);
          }
        }
      } catch (ex) {
        logger.error(ex);
      }
    }

    await zip(configTmpPath, configZipFile);
    return res.download(configZipFile, `${tmpPath}.zip`);
  } catch (e) {
    logger.error('coldWalletExport', e);
  }

  return res.json({ result: 'failed' });
});

router.get('/coldWalletExport', async (req, res, next) => {
  try {
    const obj = {};
    const data = await Key.findAll({
      order: [
        ['blockchain', 'ASC'],
      ]
    });

    data.forEach(dt => {
      const wa = getWalletAddress(dt.details);
      obj[dt.blockchain] = wa;
    });

    await writeFile(coldWalletFile, JSON.stringify(obj, null, 4));
    return res.download(coldWalletFile, `${new Date().toISOString().substring(0, 10)}-coldwallet.json`);
  } catch (e) {
    logger.error('coldWalletExport', e);
  }

  return res.json({ result: 'failed' });
});


router.post('/coldWalletImport', async (req, res, next) => {
  try {
    let result = {};
    const { wallets } = req.body;

    const data = await Hand.findAll({
      where: {
        mode: { [Op.in]: ['fullnode', 'wallet'] },
      }
    });

    for (let i = 0; i < data.length; i++) {
      try {
        const { url, hostname, blockchain } = data[i];
        if (url && wallets[blockchain]) {
          let finalUrl = `${url}/blockchainsWorker/savecoldwallet`;
          const apiRes = await axios.post(finalUrl, { coldWalletAddress: wallets[blockchain] },
            { timeout: 5000, headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
              logger.error(error);
            });
          result[blockchain] = apiRes && apiRes.data;

          finalUrl = `${url}/blockchainsWorker/restart`;
          await axios.get(finalUrl, { timeout: 5000, headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) { logger.error(error); });
        }
      } catch (ex) {
        logger.error(ex);
      }
    }

    return res.json(result);
  } catch (e) {
    logger.error('coldWalletImport', e);
  }

  return res.json({ status: 'failed' });
});

router.get('/createPasswordWeb', async (req, res, next) => {
  res.render('index', { pageName: 'createPassword' });
});

router.post('/createPasswordOp', async (req, res, next) => {
  try {
    const { password } = req.body;
    logger.debug('createPasswordOp');
    const data = await AppConfig.findOne({
      where: { key: 'password' }
    });

    if (!data) {
      await AppConfig.upsert({ key: 'password', value: password });
      return res.json({ status: 'success' });
    }
  } catch (e) {
    logger.error('createPasswordOp', e);
  }

  return res.json({ status: 'failed' });
});

router.get('/resetPasswordWeb', async (req, res, next) => {
  res.render('index', { pageName: 'resetPassword' });
});

router.post('/resetPasswordOp', async (req, res, next) => {
  try {
    const { oldPassword, password } = req.body;
    logger.debug('createPasswordOp');
    const data = await AppConfig.findOne({
      where: { key: 'password' }
    });

    if (data && data.value === oldPassword) {
      await AppConfig.upsert({ key: 'password', value: password });
      return res.json({ status: 'success' });
    } else {
      return res.json({ status: 'incorrect_old_password' });
    }
  } catch (e) {
    logger.error('resetPasswordOp', e);
  }

  return res.json({ status: 'failed' });
});

router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body;
    logger.debug('login');
    const data = await AppConfig.findOne({
      where: { key: 'password' }
    });

    if (data && data.value === password) {
      req.session.authed = 'true';
      res.cookie('authed', 'true', { maxAge: 300000 });

      return res.json({ status: 'success' });
    }
  } catch (e) {
    logger.error('login', e);
  }

  return res.json({ status: 'failed' });
});

router.get('/logout', async (req, res, next) => {
  try {
    logger.debug('logout');
    req.session.destroy();
    res.cookie('authed', '', { expires: new Date(0) });
  } catch (e) {
    logger.error('logout', e);
  }

  return res.redirect('/reviewWeb');
});

router.get('/harvesterWeb', async (req, res, next) => {
  let result = { status: 'failed' };

  try {
    logger.debug('harvesterWeb');
    const data = await Hand.findAll({
      where: {
        mode: 'fullnode'
      }
    });

    for (let i = 0; i < data.length; i++) {
      try {
        const { url, hostname, blockchain } = data[i];
        const finalUrl = `${url}/certificates/allowHarvester`;
        const apiRes = await axios.get(finalUrl, { timeout: 5000, headers: { 'tk': getWorkerToken(hostname, blockchain) } }).catch(function (error) {
          logger.error(error);
        });
      } catch (ex) {
        logger.error(ex);
      }
    }

    result = { status: 'success' };
  } catch (e) {
    logger.error('harvesterWeb', e);
  }

  res.render('index', { result, pageName: 'harvester' });
});

module.exports = router;
