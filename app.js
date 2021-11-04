var createError = require('http-errors');
var express = require('express');
var url = require('url');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var i18n = require('i18n'); // require('i18n')
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
