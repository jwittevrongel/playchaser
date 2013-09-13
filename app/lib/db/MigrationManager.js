"use strict";

var fs = require('fs'),
    path = require('path'),
    config = require('../config/config'),
    mongoose = require('mongoose'),
    Migration = require('./Migration'),
    async = require('async');

var relativeMigrationDirectory = path.join('..', '..', 'db', 'migrations');
var absoluteMigrationDirectory = path.join(__dirname, relativeMigrationDirectory);

function padNumeral(numeral) {
    // pad with zeroes, to 6 places
    return Array(7 - numeral.toString().length).join('0') + numeral;
};

function makeNameFilename(migrationName) {
    return migrationName.replace(/\s+/g, '-');
};

function performMigrationUp(migrationName, callback) {
    // see if the migration has already been performed.  If so, skip it
    Migration.findById(migrationName, function(err, results) {
		if (results) {
			console.log("Migration " + migrationName + " was already applied. Skipping.");
			callback();
			return;
		}

		console.log("Applying Migration: " + migrationName);
		var executableMigration = require(path.join(relativeMigrationDirectory, migrationName));
		//executableMigration.up(mongoose, function(err) {
		//	if (err) {
		//		callback(err);
		//		return;
		//	} 
		//	var migration = new Migration({ _id: migrationName, applied: new Date() });
		//	migration.save(function(err, results) {
				callback(err);
		//	});
		//});
	});
};

function listAvailableMigrations() {
	return fs.readdirSync(absoluteMigrationDirectory)
		.filter(function(filename) {
			return (filename.indexOf('.js', filename.length - 3) !== -1);
		})
		.map(function(filename) {
			return filename.substring(0, filename.length - 3);
		});
};

exports.up = function(migrationName) {
    var allMigrations = listAvailableMigrations().sort();
    if (!allMigrations.length) {
        // no migrations, nothing to do....
        return;
	}

    if (!migrationName) {
        // find highest numbered migration if one was not provided
        migrationName = allMigrations[allMigrations.length - 1];
    } else {
        // ensure the named migration actually exists and use it.  If we can't
        // find it or can't find a unique match (multiple matches) then don't 
        // proceed
        
        // slice the array so that the target migration is the last in the list
    }

    mongoose.connect(config.db.connectionString, config.db.options);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Migration Failed.  MongoDB connection error:'));
    db.once('open', function() {
        async.eachSeries(allMigrations, performMigrationUp, function(err) {
			db.close();
		});
    });
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

    try {
        fs.mkdirSync(absoluteMigrationDirectory, parseInt('0775', 8));
    } catch (err) {
        // ignore error creating directory
    }

    var existingMigrationOrdinals = fs.readdirSync(absoluteMigrationDirectory).map(function(filename) {
        return parseInt(filename.match(/^(\d+)/)[1], 10);
    }).sort(function(a, b) {
        return a - b;   
    });
    
    var nextOrdinal = (existingMigrationOrdinals.pop() || 0) + 1;
    var fileName = padNumeral(nextOrdinal) + "-" + makeNameFilename(migrationName) + ".js";
    var absoluteFileName = path.join(absoluteMigrationDirectory, fileName);
    fs.writeFileSync(absoluteFileName, migrationTemplate, { mode: parseInt('0664', 8) });
    console.log("  Created Migration '" + path.join(relativeMigrationDirectory, fileName)); + "'";
};

    

