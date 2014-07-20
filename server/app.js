"use strict";

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    authentication = require('./authentication'),
    config = require ('./config'),
    mongoose = require('mongoose'),
    ioServer = require('socket.io'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
	session = require('express-session'),
	morgan = require('morgan'),
	compression = require('compression'),
	errorHandler = require('errorhandler');
	
var app = express();

app.set('port', config.port || 3000);
app.use(compression());
app.use(morgan('dev'));
app.use(cookieParser(config.session.secrets.cookie));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ 
	secret: config.session.secrets.express, 
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: config.session.timeout
	},
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(authentication);

app.use(express.static(path.join(__dirname, '..', 'static')));

// add error handler in development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

mongoose.connect(config.db.connectionString);

var server = http.Server(app);
/*var io = */ioServer.listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// routes
authentication.configureRoutes(app);


