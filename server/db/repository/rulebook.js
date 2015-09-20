"use strict";

var SCHEMA = 'gameLibrary',
    COLLECTION = 'rulebooks';

var repository = require('./'),
    rulebook = require('../../domain/gameroom/rulebook');

var Rulebook = repository.generateMongoRepository(SCHEMA, COLLECTION);

Rulebook.prototype.save = function(rulebook) {
	return this._collection.updateOneAsync({
		"_id": rulebook._id
	}, rulebook, { upsert: true })
	.then(function() {
		return rulebook;
	});
};

Rulebook.prototype.removeById = function(id) {
	return this._collection.deleteOneAsync({
		"_id": id
	});
};

Rulebook.prototype.findById = function(id) {
	return this.hydrateOne(rulebook.create, this._collection.findOneAsync({
		"_id": id
	}));
};

Rulebook.prototype.findAll = function() {
	var self = this;
	return this._collection.findAsync().then(function(cursor) {
		return self.hydrateMany(rulebook.create, cursor.toArrayAsync());
	});
};

module.exports = repository.generateMongoExports(Rulebook);


