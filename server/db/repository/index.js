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

function extendMongoRepository(MongoRepository, indexes) {
	
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
	
	return MongoRepository;
}

exports.generateMongoRepository = function(schemaName, collectionName, indexes) {
	function MongoRepository(db) {
		this._db = db;
		this._collection = db.collection(collectionName);
	}
	
	MongoRepository.schemaName = schemaName;
	MongoRepository.collectionName = collectionName;
	MongoRepository.prototype.hydrateOne = exports.hydrateOne;
	MongoRepository.prototype.hydrateMany = exports.hydrateMany;
	
	return extendMongoRepository(MongoRepository, indexes);
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

function extendRedisRepository(RedisRepository, collectionName) {
	var _nextIdKey = "_sequence:" + collectionName;
	
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
	
	return RedisRepository;
}

exports.generateRedisRepository = function(schemaName, collectionName) {
	
	function RedisRepository(publisher, subscriber) {
		this._publisher = publisher;
		this._subscriber = subscriber;
	}
	
	RedisRepository.schemaName = schemaName;
	RedisRepository.collectionName = collectionName;
	RedisRepository.prototype.hydrateOne = exports.hydrateOne;
	RedisRepository.prototype.hydrateMany = exports.hydrateMany;
	
	return extendRedisRepository(RedisRepository, collectionName);
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

exports.generateHybridRepository = function(schemaName, collectionName, indexes) {
	
	function HybridRepository(mongo, redisPublisher, redisSubscriber) {
		this._db = mongo;
		this._collection = mongo.collection(collectionName);
		this._publisher = redisPublisher;
		this._subscriber = redisSubscriber;
	}
	
	HybridRepository.schemaName = schemaName;
	HybridRepository.collectionName = collectionName;
	HybridRepository.prototype.hydrateOne = exports.hydrateOne;
	HybridRepository.prototype.hydrateMany = exports.hydrateMany;
	
	return extendMongoRepository(extendRedisRepository(HybridRepository, collectionName), indexes);
};

exports.generateHybridExports = function(HybridRepository) {
	return {
		open: function open(mongo, redisPublisher, redisSubscriber) {
			return new HybridRepository(mongo, redisPublisher, redisSubscriber);
		},
		schemaName: HybridRepository.schemaName,
		collectionName: HybridRepository.collectionName	
	};
};



