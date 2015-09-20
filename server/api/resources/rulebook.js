"use strict";

var rulebookRepository = require('../../db/repository/rulebook'),
    Promise = require('bluebird'),
    connection = require('../../db/connection'),
    HttpStatus = require('http-status-codes');

exports.getAll = function() {
	return Promise.using(connection.connectToGameLibraryDatabase(), function(db) {
		var repos = rulebookRepository.open(db);
	
		return repos.findAll().then(function(ruleBooks) {
			return { status: HttpStatus.OK, value: ruleBooks };
		});
	});
};