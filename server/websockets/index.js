"use strict";

var ws = require('ws'),
	config = require('../config'),
	cookieParser = require('cookie-parser')(config.session.secrets.cookie),
	async = require('async'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	expressSession = session({ 
		secret: config.session.secrets.express, 
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: config.session.timeout
		},
		store: new MongoStore({
			url: config.db.connectionString
		}),
		resave: true,
		saveUninitialized: true
	}),
	passport = require('passport'),
	passportInit = passport.initialize(),
	passportSession = passport.session();

var attachRoutes = function(/*socket*/) {

};

function WebSocketServer(server) {
	var wss = new ws.Server({server: server});
	var fakeResponse = {};
	wss.on('connection', function(socket) {
		async.series([
			function(callback) {
				cookieParser(socket.upgradeReq, fakeResponse, callback); 
			},
			function(callback) {
				expressSession(socket.upgradeReq, fakeResponse, callback);
			},
			function(callback) {
				passportInit(socket.upgradeReq, fakeResponse, callback);
			},
			function(callback) {
				passportSession(socket.upgradeReq, fakeResponse, callback);
			}
		], function() {
			socket.user = socket.upgradeReq.user;
			if (socket.user) {
				attachRoutes(socket);
			} else {
				socket.terminate();
			}
		});
	});
}

WebSocketServer.prototype.route = function(path) {
	return path;
};

module.exports = WebSocketServer;


