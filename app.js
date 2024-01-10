var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Sequelize = require("sequelize");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
var uid = require("uid");
require('dotenv').config();
var cors = require('cors');
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true
};


var app = express()
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});
var sess = {
  genid: function() {
    return uid.uid(); // use UUIDs for session IDs
  },
  name: 'sessionId',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
};


if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session({
  ...sess,
  store: new SequelizeStore({
    db: sequelize,
  }),
}))

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
  res.send({
    'status':'Error',
    'code':err.status || 500,
    'message':err.message,
  });
  console.log(err);
});



module.exports = app;


