var express = require('express');
var app = express();

var options = {
    extensions: ['htm', 'html'],
    maxAge: '0',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now());
    }
  }
  
  app.use(express.static('client', options));
  
  app.listen(3000)