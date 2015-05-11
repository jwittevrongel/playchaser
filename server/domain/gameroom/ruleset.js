"use strict";

function Ruleset(id, name) {
	this._id = id;
	this.name = name;
}

Ruleset.prototype.isValid = function() {
	return (this._id && this.name);
};

exports.createRuleset = function(id, name) {
	if (!id || !name) {
        throw new Error("must provide id and name");
    }
	
	return new Ruleset(id, name);
};

exports.create = function() {
	return new Ruleset(null, null);
};