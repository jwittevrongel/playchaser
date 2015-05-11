"use strict";

var Promise = require('bluebird'),
	mongodb = Promise.promisifyAll(require('mongodb')),
    MongoClient = Promise.promisifyAll(mongodb.MongoClient),
	redis = Promise.promisifyAll(require('redis')),
	config = require('../config');
	

var _mongoConnections = { };

function openMongoConnection(schemaName, db) {
	var connectionReference = _mongoConnections[schemaName];
	if (connectionReference && connectionReference.referenceCount > 0) {
		connectionReference.referenceCount = connectionReference.referenceCount + 1;
	} else {
		connectionReference = _mongoConnections[schemaName] = {
			referenceCount: 1,
			connection: MongoClient.connectAsync(db.connectionString, db.options)
		};
	}
	return connectionReference.connection.disposer(function(connection) {
		_mongoConnections[schemaName].referenceCount = _mongoConnections[schemaName].referenceCount - 1;
		if (0 === _mongoConnections[schemaName].referenceCount) {
			connection.close();	
		}
	});
}

function openRedisConnection(db) {
	return redis.createClient(db.port, db.host, db.options)
		.disposer(function(connection) {
			connection.quit();
		});
}

exports.connectToMongoDatabase = function(schemaName) {
	return openMongoConnection(schemaName, config.db.mongo[schemaName]);
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

