"use strict";

var fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    mongoose = require('mongoose'),
    Migration = require('./Migration'),
    async = require('async');

var migrationDirectory = path.join(__dirname, 'migrations');

function padNumeral(numeral) {
    // pad with zeroes, to 6 places
    return new Array(7 - numeral.toString().length).join('0') + numeral;
}

function makeNameFilename(migrationName) {
    return migrationName.replace(/\s+/g, '-');
}

function performMigrationUp(migrationName, callback) {
    // see if the migration has already been performed.  If so, skip it
    Migration.findById(migrationName, function(err, results) {
        if (results) {
            // already applied
            callback();
            return;
        }

        console.log("Applying Migration: " + migrationName);
        var executableMigration = require(path.join(migrationDirectory, migrationName));
        executableMigration.up(mongoose, function(err) {
            if (err) {
                callback(err);
                return;
            } 
            var migration = new Migration({ _id: migrationName, applied: new Date() });
            migration.save(function(err) {
                callback(err);
            });
        });
    });
}

function performMigrationDown(migrationName, callback) {
    // see if the migration was previously performed.  If not, skip it
    Migration.findById(migrationName, function(err, results) {
        if (!results) {
            // already applied
            callback();
            return;
        }

        console.log("Reverting Migration: " + migrationName);
        var executableMigration = require(path.join(migrationDirectory, migrationName));
        executableMigration.down(mongoose, function(err) {
            if (err) {
                callback(err);
                return;
            } 
            Migration.remove({ _id: migrationName }, function(err) {
                callback(err);
            });
        });
    });
}

function listAvailableMigrations() {
    return fs.readdirSync(migrationDirectory)
        .filter(function(filename) {
            return (filename.indexOf('.js', filename.length - 3) !== -1);
        })
        .map(function(filename) {
            return filename.substring(0, filename.length - 3);
        });
}

function performMigrations(migrationName, migrationList, migrationFunction) {

    if (!migrationList.length) {
        // no migrations, nothing to do....
        return;
    }

    if (!migrationName) {
        // migrate to the end if no migration name was supplied
        migrationName = migrationList[migrationList.length - 1];
    } else {
        // ensure the named migration actually exists and use it.  If we can't
        // find it or can't find a unique match (multiple matches) then don't 
        // proceed
        var foundCount = 0;
        var originalMigrationName = migrationName;
        for (var i = 0; i < migrationList.length; ++i) {
            if (migrationList[i].indexOf(originalMigrationName) !== -1) {
                ++foundCount;
                migrationName = migrationList[i];
            }
        }
        if (foundCount === 0) {
            console.log("Error: Could not find a migration matching the name '" + originalMigrationName + "'");
            return;
        }
        if (foundCount > 1) {
            console.log("Error: Multiple Migrations found that match the name '" + originalMigrationName + "'");
            return;
        }
        // slice the array so that the target migration is the last in the list
        migrationList = migrationList.slice(0, migrationList.indexOf(migrationName) + 1);
    }

    mongoose.connect(config.db.connectionString, config.db.options);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Migration Failed.  MongoDB connection error:'));
    db.once('open', function() {
        async.eachSeries(migrationList, migrationFunction, function() {
            db.close();
        });
    });

}

exports.up = function(migrationName) {
    performMigrations(migrationName, listAvailableMigrations().sort(), performMigrationUp);
};

exports.down = function(migrationName) {
    performMigrations(migrationName, listAvailableMigrations().sort().reverse(), performMigrationDown);
};

exports.create = function(migrationName) {
    var migrationTemplate = [
        '"use strict"',
        '',
        'exports.up = function(mongoose, next) {',
        '    next();',
        '};',
        '',
        'exports.down = function(mongoose, next) {',
        '    next();',
        '};',
        ''
    ].join('\n');

    try {
        fs.mkdirSync(migrationDirectory, parseInt('0775', 8));
    } catch (err) {
        // ignore error creating directory
    }

    var existingMigrationOrdinals = fs.readdirSync(migrationDirectory).map(function(filename) {
        return parseInt(filename.match(/^(\d+)/)[1], 10);
    }).sort(function(a, b) {
        return a - b;   
    });
    
    var nextOrdinal = (existingMigrationOrdinals.pop() || 0) + 1;
    var fileName = padNumeral(nextOrdinal) + "-" + makeNameFilename(migrationName) + ".js";
    var absoluteFileName = path.join(migrationDirectory, fileName);
    fs.writeFileSync(absoluteFileName, migrationTemplate, { mode: parseInt('0664', 8) });
    console.log("  Created Migration '" + path.join(migrationDirectory, fileName) + "'");
};

    

