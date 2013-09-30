"use strict";

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    authentication = require('./lib/authentication'),
    config = require ('./lib/config'),
    mongoose = require('mongoose');

var app = express();

app.configure(function() {
    app.set('port', config.port || 3000);
    app.use(express.logger('dev'));
    app.use(express.cookieParser(config.session.secrets.cookie));
    app.use(express.bodyParser());
    app.use(express.session({ 
        secret: config.session.secrets.express, 
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: config.session.timeout
        }
    }));
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

mongoose.connect(config.db.connectionString);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// for now, put routes here
// I expect to refactor at some point, but I don't know how it should look yet.

// login page
app.get('/login', function (req, res) {
    res.sendfile(path.join(__dirname, 'client', 'login.html'));
}); 

// handle local authentication (non-OAuth)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
