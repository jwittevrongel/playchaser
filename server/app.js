"use strict";

var express = require('express'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    passport = require('passport'),
    authentication = require('./authentication'),
    config = require ('./config'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
	session = require('express-session'),
	morgan = require('morgan'),
	compression = require('compression'),
	errorHandler = require('errorhandler'),
	WebSocketServer = require('./websockets'),
	MongoStore = require('connect-mongo')(session),
	gameEngine = require('./game'),
	middleware = require('./middleware');
	
var app = express();
app.set('port', config.port || 3000);
app.use(compression());
app.use(middleware.staticExpires);
app.use(morgan('dev'));
var cookieParserInstance = cookieParser(config.session.secrets.cookie);
app.use(cookieParserInstance);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.db.connectionString, function(e){
	if(e) {
		// error connecting
		throw e;
  	}
	var sessionStore = new MongoStore({ mongoose_connection: mongoose.connection });
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
	app.use(authentication);
	app.use(express.static(path.join(__dirname, '..', 'static')));
	
	// add error handler in development only
	if ('development' == app.get('env')) {
		app.use(errorHandler());
	}

	var server;
	if (config.secure) {
		server = https.Server(config.secure, app);
	}
	else {
		server = http.Server(app);
	}
	var wsServer = new WebSocketServer({
		server: server,
		authenticationMiddleware: [
			cookieParserInstance,
			expressSession,
			passportInit,
			passportSession
		]
	});

	// routes
	authentication.configureRoutes(app);
	config.clientEnvironment.configureRoutes(app);
	gameEngine.configureRoutes(app);
	wsServer.route('foo');
	
	server.listen(app.get('port'), function(){
	  console.log('Playchaser running on port ' + app.get('port'));
	});

});