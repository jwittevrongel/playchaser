"use strict";

var Promise = require('bluebird'),
	_ = require('lodash');

exports.hydrateOne = function(proto, promise) {
	return promise.then(function(oneFromDb) {
		if (!oneFromDb) {
			return null;
		}
		return _.merge(proto(), oneFromDb);
	});	
};

exports.hydrateMany = function(proto, promise) {
	return promise.then(function(manyFromDb) {
		if (!manyFromDb) {
			return null;
		}
		return _.map(manyFromDb, function(oneFromDb) {
			return _.merge(proto(), oneFromDb);
		});
	});	
};

exports.generateMongoRepository = function(schemaName, collectionName, indexes) {
	function MongoRepository(db) {
		this._db = db;
		this._collection = db.collection(collectionName);
	}
	MongoRepository.schemaName = schemaName;
	MongoRepository.collectionName = collectionName;
	
	if (indexes) {
		MongoRepository.prototype.initializeIndices = function() {
			return this._collection.createIndexesAsync(indexes);
		};
		MongoRepository.prototype.dropIndices = function() {
			return this._collection.dropIndexesAsync();
		};	
	} else {
		MongoRepository.prototype.initializeIndices = function() {
			return Promise.resolve();
		};
		MongoRepository.prototype.dropIndices = function() {
			return Promise.resolve();
		};
	}
	
	MongoRepository.prototype.hydrateOne = exports.hydrateOne;
	MongoRepository.prototype.hydrateMany = exports.hydrateMany;
	
	return MongoRepository;
};

exports.generateMongoExports = function(MongoRepository) {
	return {
		open: function open(db) {
			return new MongoRepository(db);
		},
		schemaName: MongoRepository.schemaName,
		collectionName: MongoRepository.collectionName
	};
};

exports.generateRedisRepository = function(schemaName, collectionName) {
	var _nextIdKey = "_sequence:" + collectionName;
	function RedisRepository(publisher, subscriber) {
		this._publisher = publisher;
		this._subscriber = subscriber;
	}
	RedisRepository.schemaName = schemaName;
	RedisRepository.collectionName = collectionName;
	
	RedisRepository.prototype.canSubscribe = function canSubscribe() {
		return !!this._subscriber;
	};
	
	RedisRepository.ensureId = function(obj) {
		if (obj._id) {
			return Promise.resolve(obj);
		}
		return this.getNextId()
			.then(function(id) {
				obj._id = id;
				return obj;
			});	
	};
	
	RedisRepository.prototype.getNextId = function() {
		return this._publisher.incrAsync(_nextIdKey);
	};
	
	RedisRepository.prototype.hydrateOne = exports.hydrateOne;
	RedisRepository.prototype.hydrateMany = exports.hydrateMany;
	
	return RedisRepository;
};

exports.generateRedisExports = function(RedisRepository) {
	return {
		open: function open(publisher, subscriber) {
			return new RedisRepository(publisher, subscriber);
		},
		schemaName: RedisRepository.schemaName,
		collectionName: RedisRepository.collectionName	
	};
};



