var createError = require('http-errors');
const express = require('express');
var url = require('url');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var i18n = require('i18n');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {
  actionsRouter,
  analysisRouter,
  blockchainsRouter,
  certificatesRouter,
  challengesRouter,
  configsRouter,
  connectionsRouter,
  handsRouter,
  farmsRouter,
  keysRouter,
  logsRouter,
  newsRouter,
  partialsRouter,
  pingRouter,
  plotnftsRouter,
  plotsRouter,
  poolsRouter,
  statsRouter,
  walletsRouter,
} = require('./apis');

const {
  blockchainsWeb,
  coldWalletWeb,
  connectionsWeb,
  dailyReportWeb,
  handsWeb,
  keysWeb,
  newsWeb,
  plotsWeb,
  poolsWeb,
  receivedCoinsWeb,
  reviewWeb,
  settingsWeb,
  walletsWeb,
  weeklyReportWeb,
} = require('./routes');

// another 'global' object that is bound to i18n additionaly
// DANGER! this `funkyObject` is NOT concurrency aware,
// while req, res and res.locals are and will always be
var funkyObject = {};

i18n.configure({
  locales: ['en', 'de'],
  register: funkyObject,
  directory: path.join(__dirname, 'locales'),
  updateFiles: false,
  cookie: 'language',
  defaultLocale: 'en',
  queryParameter: 'lang',
});

var app = express();
app.use(cookieParser());
app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ************* web pages begin ************* */
app.use('/', reviewWeb);
app.use('/users', usersRouter);
app.use('/blockchainsWeb', blockchainsWeb);
app.use('/coldWalletWeb', coldWalletWeb);
app.use('/connectionsWeb', connectionsWeb);
app.use('/dailyReportWeb', dailyReportWeb);
app.use('/handsWeb', handsWeb);
app.use('/keysWeb', keysWeb);
app.use('/newsWeb', newsWeb);
app.use('/plotsWeb', plotsWeb);
app.use('/poolsWeb', poolsWeb);
app.use('/receivedCoinsWeb', receivedCoinsWeb);
app.use('/reviewWeb', reviewWeb);
app.use('/settingsWeb', settingsWeb);
app.use('/walletsWeb', walletsWeb);
app.use('/weeklyReportWeb', weeklyReportWeb);
/* ************* web pages end ************* */

/* ************* apis begin ************* */
app.use('/actions', actionsRouter);
app.use('/analysis', analysisRouter);
app.use('/blockchains', blockchainsRouter);
app.use('/certificates', certificatesRouter);
app.use('/challenges', challengesRouter);
app.use('/configs', configsRouter);
app.use('/connections', connectionsRouter);
app.use('/hands', handsRouter);
app.use('/farms', farmsRouter);
app.use('/keys', keysRouter);
app.use('/logs', logsRouter);
app.use('/news', newsRouter);
app.use('/partials', partialsRouter);
app.use('/ping', pingRouter);
app.use('/plotnfts', plotnftsRouter);
app.use('/plots', plotsRouter);
app.use('/pools', poolsRouter);
app.use('/stats', statsRouter);
app.use('/wallets', walletsRouter);
/* ************* apis end ************* */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
