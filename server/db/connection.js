"use strict";

var Promise = require('bluebird'),
	mongodb = Promise.promisifyAll(require('mongodb')),
    MongoClient = Promise.promisifyAll(mongodb.MongoClient),
	redis = Promise.promisifyAll(require('redis')),
	config = require('../config');

var _databaseConnections = { };

function databaseConnectionDisposer(schemaName, closerFunction) {
	return function disposeConnection(connection) {
		_databaseConnections[schemaName].referenceCount = _databaseConnections[schemaName].referenceCount - 1;
		if (0 === _databaseConnections[schemaName].referenceCount) {
			closerFunction(connection);
		}
	};
}

function openDatabaseConnection(schemaName, db, connectorFunction, closerFunction) {
	var connectionReference = _databaseConnections[schemaName];
	if (connectionReference && connectionReference.referenceCount > 0) {
		connectionReference.referenceCount = connectionReference.referenceCount + 1;
	} else {
		connectionReference = _databaseConnections[schemaName] = {
			referenceCount: 1,
			connection: connectorFunction(db),
			disposer: databaseConnectionDisposer(schemaName, closerFunction)
		};
	}
	return connectionReference.connection.disposer(connectionReference.disposer);
}

function mongoConnector(db) {
	return MongoClient.connectAsync(db.connectionString, db.options);
}

function mongoCloser(connection) {
	connection.close();
}

function openMongoConnection(schemaName, db) {
	return openDatabaseConnection(schemaName, db, mongoConnector, mongoCloser);
}

function openRedisPublisherConnection(db) {
	return redis.createClient(db.port, db.host, db.options);
}

function openRedisSubscriberConnection(db) {
	if (!db.canSubscribe) {
		return undefined;
	}
	return redis.createClient(db.port, db.host, db.options);
}

function redisConnector(db) {
	return Promise.join(openRedisPublisherConnection(db), openRedisSubscriberConnection(db), function(publisher, subscriber) {
		return { publisher: publisher, subscriber: subscriber };
	}); 
}

function redisCloser(connection) {
	connection.publisher.quit();
	if (connection.subscriber) {
		connection.subscriber.quit();
	}
}

function openRedisConnection(schemaName, db) {
	return openDatabaseConnection(schemaName, db, redisConnector, redisCloser);
}

function hybridConnector(db) {
	return Promise.join(redisConnector(db.redis), mongoConnector(db.mongo), function(rdb, mdb){
		return { redis: rdb, mongo: mdb };
	});
}

function hybridCloser(connection) {
	redisCloser(connection.redis);
	mongoCloser(connection.mongo);
}

function openHybridConnection(schemaName, db) {
	return openDatabaseConnection(schemaName, db, hybridConnector, hybridCloser);
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

exports.connectToRedisDatabase = function(schemaName) {
	return openRedisConnection(schemaName, config.db.redis[schemaName]);
};

exports.connectToHybridDatabase = function(schemaName) {
	return openHybridConnection(schemaName, config.db.hybrid[schemaName]);
};

exports.connectToGameRoomDatabase = function() {
	return exports.connectToHybridDatabase('gameRoom');
};

