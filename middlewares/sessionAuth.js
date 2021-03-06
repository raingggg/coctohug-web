const { setLastWebReviewPageAccessTime } = require('../utils/chiaConfig');
const { notifyWorkersWebAccessing } = require('../dataHelpers/blockchains');

const securePaths = [
  '/settingsWeb/restartWeb',
  '/settingsWeb/restartOp',
  '/settingsWeb/coldWalletWeb',
  '/settingsWeb/coldWalletExport',
  '/settingsWeb/coldWalletImport',
  '/settingsWeb/resetPasswordWeb',
  '/settingsWeb/resetPasswordOp',
  '/settingsWeb/restartOp',
  '/settingsWeb/restartOp'
];

const sessionAuth = async (req, res, next) => {
  const { originalUrl } = req;
  const authed = req.session && req.session.authed && req.session.authed === 'true';

  const isReviewPage = originalUrl.includes('/reviewWeb');
  if (isReviewPage) {
    setLastWebReviewPageAccessTime(); // web-controller side update
    notifyWorkersWebAccessing(); // notify workerAPI all forks
  }

  for (let i = 0; i < securePaths.length; i++) {
    if (!authed && originalUrl.includes(securePaths[i])) {
      res.cookie('authed', '', { expires: new Date(0) });
      return res.redirect('/reviewWeb');
    }
  }

  next();
}

module.exports = sessionAuth;