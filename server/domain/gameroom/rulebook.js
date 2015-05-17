"use strict";

function Rulebook(id, name) {
	this._id = id;
	this.name = name;
}

Rulebook.prototype.isValid = function() {
	return (this._id && this.name);
};

exports.createRulebook = function(id, name) {
	if (!id || !name) {
        throw new Error("must provide id and name");
    }
	
	return new Rulebook(id, name);
};

exports.create = function() {
	return new Rulebook(null, null);
};