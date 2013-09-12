"use strict";

var fs = require('fs'),
    path = require('path');
	    
exports.up = function(migrationName) {
};

exports.down = function(migrationName) {
};

exports.create = function(migrationName) {
	var migrationTemplate = [
		'"use strict"',
		'',
		'exports.up = function(mongoose, next) {',
		'    next();',
		'}',
		'',
		'exports.down = function(mongoose, next) {',
		'    next();',
		'}',
		''
	].join('\n');
	
	
	
};

	

