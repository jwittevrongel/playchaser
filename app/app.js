"use strict";

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    authentication = require('./lib/authentication');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));
    app.use(express.cookieParser('your secret here'));
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'another secret here' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(authentication);
    app.use(express.static(path.join(__dirname, 'client')));

    // add error handler in development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
