"use strict";

var repository = require('./'),
    promise = require('bluebird');
	
var SCHEMA = 'gameRoom',
    COLLECTION = 'tables';
	
var TableRepository = repository.generateRedisRepository(SCHEMA, COLLECTION);

//// Redis layout: single table properties
// HASH @@ tables:{id}
//         Contains the table's direct properties: name, owner id, seat limits
// HASH @@ tables:{id}:variant
//         Contains the variant's settings as key/value pairs.  Key/value pairs in the hash based on the ruleset.
// HASH @@ tables:{id}:roles
//         Contains the players' assignments to roles (eg color assignment, turn order).  Player IDs are keys in the hash, to JSON values
// LIST @@ tables:{id}:seats
//         List of player ids for players currently occupying seats at the table
// SET  @@ tables:{id}:ready
//         Set of player ids who have indicated "ready to play"

//// Redis layout: lists of tables for searching
// SET  @@ tables:{rulebook}
//         Contains a list of all current tables with a given rulebook
// SET  @@ tables:{rulebook}:open
//         Contains a list of all tables with the given rulebook that are looking for players
//         Does not include "private" tables where an invite code is needed

function generateKeys(db, table) {
	return db.ensureId(table)
		.then(function(table) {
			var main = COLLECTION + ":" + table._id;
			var rulebookList = COLLECTION + ":" + table.rulebook._id;
			return {
				main: main,
				variant: main + ":variant",
				roles: main + ":roles",
				seats: main + ":seats",
				ready: main + ":ready",
				allTables: rulebookList,
				openTables: rulebookList + ":open" 
			};
		});
}

function getDirectProperties(table) {
	return {
		owner: table.owner._id,
		name: table.name,
		rulebook: table.rulebook._id,
		minSeats: table.participants.min,
		maxSeats: table.participants.max
	};
}

// KEYS=[main, seats, openTables]
// ARGV=[table id, player id]
var joinTableScript = "local maxSeats = redis.call('hget', KEYS[1], 'maxSeats') " +
                      "local occupiedCount = redis.call('lpush', KEYS[2], ARGV[2]) " +
					  "if occupiedCount < maxSeats then " +
					  "  redis.call('sadd', KEYS[3], ARGV[1]) " +
					  "elseif occupiedCount == maxSeats then " + 
					  "  redis.call('srem', KEYS[3], ARGV[1]) " +
                      "else " + 
					  "  redis.call('ltrim, KEYS[2], 0, maxSeats - 1) " +
					  "end " +
					  "return (occupiedCount <= maxSeats)";

function tryJoinTable(connection, keys, table, joiner) {
	return connection.evalAsync(joinTableScript, 3, keys.main, keys.seats, keys.openTables, table._id, joiner._id);
}

TableRepository.prototype.create = function(table) {
	return generateKeys(this, table)
		.then(function(keys) {
			return this._producer.multi()
				.hmset(keys.main, getDirectProperties(table))
				.sadd(keys.allTables, table._id)
				.execAsync()
				.then(function() {
					return tryJoinTable(this._producer, keys, table, table.owner);
				});
		})
		.then(function(succeeded) {
			if (succeeded) {
			    return table;
			}
			return promise.reject("Table Creation Failed");
		});
};

module.exports = repository.generateRedisExports(TableRepository);