var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose');

require('dotenv').config();

// express
var indexRouter = require('./routes/index');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mongodb
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
        .then(function() {
            console.log('Connected to MongoDB');
            console.log('Database:', mongoose.connection.name);
            console.log('Host:', mongoose.connection.host);
        })
        .catch(function(error) {
            console.error('MongoDB connection failed:', error.name);
        });
} else {
    console.log('MONGODB_URI is not set. The pages will load, but reservations cannot be saved.');
}

app.use('/', indexRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
