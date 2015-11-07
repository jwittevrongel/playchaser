"use strict";

var tableRepository = require('../../db/repository/table'),
    table = require('../../domain/gameroom/table'),
    Promise = require('bluebird'),
    connection = require('../../db/connection'),
	resource = require('./'),
	rulebookResource = require('./rulebook'),
	_ = require('lodash');

exports.postTables = function(newTable, owner, baseUri) {
	if (!newTable.rulebook || !newTable.rulebook._id) {
		return resource.badRequest();
	}
	
	return rulebookResource.getRulebook(newTable.rulebook._id).then(function (rulebook) {
		if (!rulebook.isSuccess()) {
			return resource.badRequest();
		}
		
		var createdTable = table.createTable(owner, rulebook.value);
		return Promise.using(connection.connectToGameRoomDatabase(), function(db) {
			var repos = tableRepository.open(db);
			return resource.created(repos.create(createdTable), baseUri + '/' + createdTable._id);
		});
	});
};

exports.getTables = function(parameters, participant) {
	if (!parameters.open && !parameters.mine) {
		parameters.open = parameters.mine = true;
	}
	
	return Promise.using(connection.connectToGameRoomDatabase(), function(db) {
		var promises = [];
		var repos = tableRepository.open(db);
		if (parameters.open) {
			promises.push(repos.findOpen(parameters.rulebook));
		}
		if (parameters.mine) {
			promises.push(repos.findByParticipant(participant, parameters.rulebook));
		}
		
		return Promise.all(promises).then(function(results) {
			return resource.ok(_.uniq(_.flatten(results), function(table) {
				return table._id;
			}));
		});
	});
};
