"use strict";

var ws = require('ws'),
	async = require('async');

function WebSocketServer(options) {
	this._options = options;
	this._wss = new ws.Server({server: options.server, verifyClient: this._verifyClient.bind(this) });
	this._sockets = {};
	this._routes = {};
	var self = this;
	
	this._wss.on('connection', function(socket) {
		// at this point we are already validated, so set up the routing
		// and add the convenience properties.  Also, track sockets by URL.
		socket.user = socket.upgradeReq.user;
		socket.path = socket.upgradeReq.url;
		if (self._sockets[socket.path]) {
			self._sockets[socket.path].push(socket);
		} else {	
			self._sockets[socket.path] = [socket];
		}
		socket.on('close', function() {
			self._sockets[socket.path].splice(self._sockets[socket.path].indexOf(socket), 1);
		});
	});
}

WebSocketServer.prototype._verifyClient = function(info, callback) {
	// manually run the express middleware to get the user in the request; if it's not
	// there by the end of the middleware, respond with a 401.
	var fakeResponse = {};
	async.eachSeries(this._options.authenticationMiddleware, function(middleware, next) {
		middleware(info.req, fakeResponse, next);
	}, function() {
		if (info.req.user) {
			callback(true);
		} else {
			callback(false, 401, "Unauthorized.");
		}
	});
};

WebSocketServer.prototype.getSocketsFor = function(path) {
	return this._sockets[path] || [];
};

WebSocketServer.prototype.route = function(path) {
	return path;
};

module.exports = WebSocketServer;


