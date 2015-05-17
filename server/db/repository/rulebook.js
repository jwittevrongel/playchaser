"use strict";

var SCHEMA = 'gameLibrary',
    COLLECTION = 'rulebooks';

var repository = require('./');

var Rulebook= repository.generate(SCHEMA, COLLECTION);

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
	return this._collection.findOneAsync({
		"_id": id
	});
};

module.exports = repository.generateExports(Rulebook);


