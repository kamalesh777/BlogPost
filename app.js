var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogAdminRouter = require('./routes/admin');
var blogAdminLogin = require("./routes/admin-login")
var blogAdminRegister = require('./routes/admin-register');
var blogAdminDashboard = require('./routes/admin-dashboard');
var blogPost = require('./routes/new-post');
var blogViewPost = require('./routes/view-post');
var fullDetails = require('./routes/view-details');
var addCategory = require('./routes/add-category');
var anotherCategory = require('./routes/another-category');
// var blogLogin = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  secret: 'session key second time',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin-connect', blogAdminRouter);
app.use('/admin-login', blogAdminLogin);
app.use('/admin-register', blogAdminRegister);
app.use('/admin-dashboard', blogAdminDashboard);
app.use('/new-post', blogPost);
app.use('/view-post', blogViewPost);
app.use('/view-details', fullDetails);
app.use('/add-category', addCategory);
app.use('/another-category', anotherCategory);
// app.use('/users', usersRouter);

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
