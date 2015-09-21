"use strict";

var rulebookRepository = require('../../db/repository/rulebook'),
    Promise = require('bluebird'),
    connection = require('../../db/connection'),
	resource = require('./');

exports.getAll = function() {
	return Promise.using(connection.connectToGameLibraryDatabase(), function(db) {
		var repos = rulebookRepository.open(db);
		return resource.ok(repos.findAll());
	});
};

exports.get = function(id) {
	return Promise.using(connection.connectToGameLibraryDatabase(), function(db) {
		var repos = rulebookRepository.open(db);
		return resource.ok(repos.findById(id));
	});
};