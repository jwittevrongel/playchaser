"use strict";

var participant = require('./participant'),
    _ = require('lodash');

function Table(owner, rulebook) {
	if (owner) {
		this.owner = participant.create(owner);
	}
	this.rulebook = rulebook;
	this.seats = [];
	if (this.owner) {
		this.join(this.owner);
	}
}

Table.prototype.join = function(player) {
	if (!player) {
		throw new Error("player not provided");
	}
	if (!this.hasOpenSeats()) {
		throw new Error("no open seats");
	}
	var joiner = participant.create(player);
	if (!_.find(this.seats, joiner.equals, joiner)) {
		this.seats.push(joiner);
	}
};

Table.prototype.hasOpenSeats = function() {
	return(!this.game && (this.seats.length < this.rulebook.participants.max));
};

Table.prototype.leave = function(player) {
	if (!player) {
		throw new Error("player not provided");
	}
	var leaver = participant.create(player);
	
	if (leaver.equals(this.owner)) {
		throw new Error("owner cannot leave the table");
	}
	
	_.remove(this.seats, leaver.equals, leaver);
};

exports.create = function() {
	return new Table(null, null);
};

exports.createTable = function(owner, rulebook) {
	return new Table(owner, rulebook);	
};