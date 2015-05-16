"use strict";

var Promise = require('bluebird'),
	util = require('../../util');

exports.generate = function(schemaName, collectionName, indexes) {
	function RepositoryConstructor(db) {
		this._db = db;
		this._collection = db.collection(collectionName);
	}
	RepositoryConstructor.schemaName = schemaName;
	RepositoryConstructor.collectionName = collectionName;
	
	if (indexes) {
		RepositoryConstructor.prototype.initializeIndices = function() {
			return this._collection.createIndexesAsync(indexes);
		};
		RepositoryConstructor.prototype.dropIndices = function() {
			return this._collection.dropIndexesAsync();
		};	
	} else {
		RepositoryConstructor.prototype.initializeIndices = function() {
			return Promise.resolve();
		};
		RepositoryConstructor.prototype.dropIndices = function() {
			return Promise.resolve();
		};
	}
	return RepositoryConstructor;
};

exports.generateExports = function(RepoConstructor) {
	return {
		open: function open(db) {
			return new RepoConstructor(db);
		},
		schemaName: RepoConstructor.schemaName,
		collectionName: RepoConstructor.collectionName
	};
};

exports.hydrateOne = function(proto, promise) {
	return promise.then(function(oneFromDb) {
		if (!oneFromDb) {
			return null;
		}
		return util.merge(proto(), oneFromDb);
	});	
};