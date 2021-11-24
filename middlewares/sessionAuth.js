const securePaths = [
  '/settingsWeb/restartWeb',
  '/settingsWeb/restartOp',
  '/settingsWeb/coldWalletWeb',
  '/settingsWeb/coldWalletExport',
  '/settingsWeb/coldWalletImport',
  '/settingsWeb/resetPasswordWeb',
  '/settingsWeb/resetPasswordOp',
  '/settingsWeb/restartOp',
  '/settingsWeb/restartOp',
  '/walletsWeb/transferCoin'
];

const sessionAuth = (req, res, next) => {
  const { originalUrl } = req;
  const authed = req.session && req.session.authed && req.session.authed === 'true';

  for (let i = 0; i < securePaths.length; i++) {
    if (!authed && originalUrl.includes(securePaths[i])) {
      return res.redirect('/reviewWeb');
    }
  }

  next();
}

module.exports = sessionAuth;