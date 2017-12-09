var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// for static files
var options = {
  extensions: ['htm', 'html'],
  maxAge: '0',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}

app.use(express.static('client', options));

// for main pages
// var main = require('./main');
// main(app);
app.use('/task', require('./route/task')(express));
app.use('/usersubject', require('./route/usersubject')(express));
app.use('/subject', require('./route/subject')(express));

console.log('server has started');

app.listen(3000);