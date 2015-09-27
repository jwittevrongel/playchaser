"use strict";

var rulebookRepository = require('../../db/repository/rulebook'),
    Promise = require('bluebird'),
    connection = require('../../db/connection'),
	resource = require('./');

exports.getRulebooks = function() {
	return Promise.using(connection.connectToGameLibraryDatabase(), function(db) {
		var repos = rulebookRepository.open(db);
		return resource.ok(repos.findAll());
	});
};

exports.getRulebook = function(id) {
	return Promise.using(connection.connectToGameLibraryDatabase(), function(db) {
		var repos = rulebookRepository.open(db);
		return resource.ok(repos.findById(id));
	});
};