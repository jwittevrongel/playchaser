"use strict";

var SCHEMA = 'gameLibrary',
    COLLECTION = 'rulesets';

var repository = require('./');

var Ruleset = repository.generate(SCHEMA, COLLECTION);

Ruleset.prototype.save = function(ruleset) {
	return this._collection.updateOneAsync({
		"_id": ruleset._id
	}, ruleset, { upsert: true });
};

Ruleset.prototype.removeById = function(id) {
	return this._collection.deleteOneAsync({
		"_id": id
	});
};

Ruleset.prototype.findById = function(id) {
	return this._collection.findOneAsync({
		"_id": id
	});
};

module.exports = repository.generateExports(Ruleset);


