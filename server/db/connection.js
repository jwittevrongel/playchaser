"use strict";

var Promise = require('bluebird'),
    mongodb = Promise.promisifyAll(require('mongodb')),
	redis = Promise.promisifyAll(require('redis')),
	config = require('../config');
	
function openMongoConnection(db) {
	return mongodb.connectAsync(db.connectionString, db.options)
		.disposer(function(connection) {
			connection.close();
		});
}

function openRedisConnection(db) {
	return redis.createClient(db.port, db.host, db.options)
		.disposer(function(connection) {
			connection.quit();
		});
}

exports.connectToMongoDatabase = function(dbType) {
	return openMongoConnection(config.db.mongo[dbType]);
};

exports.connectToPlayerDatabase = function() {
	return exports.connectToMongoDatabase('player');
};

exports.connectToGameLibraryDatabase = function() {
	return exports.connectToMongoDatabase('gameLibrary');	
};

exports.connectToGameHistoryDatabase = function() {
	return exports.connectToMongoDatabase('gameHistory');
};

exports.connectToRedisDatabase = function(dbType) {
	return openRedisConnection(config.db.redis[dbType]);
};

exports.connectToSessionDatabase = function() {
	return exports.connectToRedisDatabase('session');
};
