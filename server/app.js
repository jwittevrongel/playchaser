"use strict";

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    authentication = require('./services/auth'),
    config = require ('./config'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
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
var cookieParserInstance = cookieParser(config.session.secrets.cookie);
app.use(cookieParserInstance);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({strict: false}));

var sessionStore = new RedisStore(config.db.redis.session);
var expressSession = session({ 
	secret: config.session.secrets.express, 
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: config.session.timeout
	},
	store: sessionStore,
	resave: true,
	saveUninitialized: true
});

app.use(expressSession);
var passportInit = passport.initialize();
var passportSession = passport.session();
app.use(passportInit);
app.use(passportSession);

// static before authenticaiton so static content all served anonymously
// in production, static content would be served by nginx anyways
if ('development' == app.get('env')) {
	app.use(express.static(path.join(__dirname, '..', 'client')));
} else {
	app.use(express.static(path.join(__dirname, '..', 'static')));
}

app.use(authentication);

// add error handler in development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

var server = http.Server(app);

//var wsServer = new WebSocketServer({
//	server: server,
//	authenticationMiddleware: [
//		cookieParserInstance,
//		expressSession,
//		passportInit,
//		passportSession
//	]
//});

// routes
restApi.configureRoutes(app);
config.clientEnvironment.configureRoutes(app);

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


