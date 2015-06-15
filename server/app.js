"use strict";

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    authentication = require('./services/auth'),
    config = require ('./config'),
    bodyParser = require('body-parser'),
	session = require('express-session'),
	morgan = require('morgan'),
	compression = require('compression'),
	errorHandler = require('errorhandler'),
	// WebSocketServer = require('./websockets'),
	RedisStore = require('connect-redis')(session),
	Promise = require('bluebird'),
	dbConnection = require('./db/connection'),
	restApi = require('./api/rest');	

var app = express();
app.set('port', config.port || 3000);
app.use(compression());
app.use(morgan('dev'));

// static before session, authenticaiton etc. so static content all served anonymously
// in production, static content would be served by nginx anyways so this is a match
if ('development' == app.get('env')) {
	app.use(express.static(path.join(__dirname, '..', 'client')));
} else {
	app.use(express.static(path.join(__dirname, '..', 'static')));
}

// define routes that don't need a session here...
restApi.configureAnonymousRoutes(app);
config.clientEnvironment.configureAnonymousRoutes(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({strict: false}));

var expressSession = session({
	name: 'pc.sess',
	secret: config.session.secrets.express, 
	cookie: {
		httpOnly: false,
		path: '/',
		maxAge: config.session.timeout
	},
	store: new RedisStore(config.db.redis.session),
	resave: false,
	saveUninitialized: false
});
var passportInit = passport.initialize();
var passportSession = passport.session();

app.use(expressSession);

app.use(passportInit);
app.use(passportSession);
app.use(authentication);

// add error handler in development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

var server = http.Server(app);

//var wsServer = new WebSocketServer({
//	server: server,
//	authenticationMiddleware: [
//		expressSession,
//		passportInit,
//		passportSession
//	]
//});

// routes
restApi.configureRoutes(app);

// gameEngine.configureRoutes(app);
// wsServer.route('foo');

Promise.using(
	dbConnection.connectToPlayerDatabase(), 
	dbConnection.connectToGameLibraryDatabase(),
	dbConnection.connectToGameHistoryDatabase(),
	dbConnection.connectToGameRoomDatabase(), 
	function() {
		server.listen(app.get('port'), function() {
  			console.log('Playchaser running on port ' + app.get('port'));
		});
		return new Promise(function(resolve) {
			server.on('close', resolve);
		});
	});


