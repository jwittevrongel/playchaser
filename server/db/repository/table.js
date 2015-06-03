"use strict";

var SCHEMA = 'gameRoom',
    COLLECTION = 'tables';

var repository = require('./');
    // table = require('../../domain/gameroom/table');

var TableRepository = repository.generateRedisRepository(SCHEMA, COLLECTION);

var OPENTABLES = ":open";
var openTablesKey = COLLECTION + OPENTABLES;

TableRepository.prototype.save = function(table) {
	var tableRulebookKey = COLLECTION + ":" + table.rulebook._id;
	return this.ensureId(table)
		.then(function(table) {
			var multi = this._publisher.multi()
				.sadd(tableRulebookKey, table._id)
				.hmset(COLLECTION + ":" + table._id, table);
			if (table.hasOpenSeats()) {
				multi = multi.sadd(openTablesKey, table._id)
					.sadd(tableRulebookKey + OPENTABLES, table._id);
			} else {
				multi = multi.srem(openTablesKey, table._id)
					.srem(tableRulebookKey + OPENTABLES, table._id);
			}
			return multi.execAsync();
		})
		.then(function() {
			return table;
		});
};

module.exports = repository.generateRedisExports(TableRepository);