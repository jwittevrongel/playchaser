"use strict";

var repository = require('./'),
    promise = require('bluebird');
	
var SCHEMA = 'gameRoom',
    COLLECTION = 'tables';
	
var TableRepository = repository.generateHybridRepository(SCHEMA, COLLECTION);

//// Redis layout: lists of tables for searching
// SET  @@ tables:{rulebook}
//         Contains a list of all current tables with a given rulebook
// SET  @@ tables:{rulebook}:open
//         Contains a list of all tables with the given rulebook that are looking for players
//         Does not include "private" tables where an invite code is needed

function updateRedisOpenSeats(redisDb, table, hasOpenSeats) {
	var openSeatsKey = 'tables:'+ table.rulebook._id + ':open';
	var hexKey = table._id.toHexString();
	if (hasOpenSeats) {
		return redisDb.saddAsync(openSeatsKey, hexKey).then(function(){ return table; });
	}
	return redisDb.sremAsync(openSeatsKey, hexKey).then(function() { return table; });
}

TableRepository.prototype.updateRemovedParticipant = function(table) {
	return this.update(table)
		.then(function(table) {
			if (table.hasOpenSeats()) { // need to double-check since the game might be in progress...
				return updateRedisOpenSeats(this._publisher, table, true);
			}
			return table;
		});
};

TableRepository.prototype.updateAddedParticipant = function(table) {
	return this.update(table)
		.then(function (table) {
			if (!table.hasOpenSeats()) { // only do this if there was a state change 
				return updateRedisOpenSeats(this._publisher, table, false);
			}
			return table;
		});
};

TableRepository.prototype.save = function(table) {
	if (table._id) {
		return this.update(table);
	}
	return this.create(table);
};

TableRepository.prototype.update = function(table) {
	return this._collection.updateOneAsync({
		"_id": table._id,
		"_rev": table._rev++
	}, table)
	.then(function(updated) {
		if (updated.ops.length !== 1) {
			return promise.reject(new repository.ConcurrentModificationError(table));
		}
		return table;
	});
};

TableRepository.prototype.create = function(table) {
	table._rev = 1;
	return this._collection.insertOne(table).then(function(inserted) {
		var baseRedisKey = 'tables:' + table.rulebook._id;
		var openSeatsKey = baseRedisKey + ':open';
		table._id = inserted.ops[0]._id;
		var hexId = table._id.toHexString();
		return this._publisher.multi()
			.sadd(baseRedisKey, hexId)
			.sadd(openSeatsKey, hexId)
			.execAsync()
			.then(function(){
				return table;		
			});
	});
};

module.exports = repository.generateHybridExports(TableRepository);