"use strict";

var fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird'),
    connection = require('./connection');

var migrationDirectory = path.join(__dirname, 'migrations');

function padNumeral(numeral) {
    // pad with zeroes, to 6 places
    return new Array(7 - numeral.toString().length).join('0') + numeral;
}

function makeNameFilename(migrationName) {
    return migrationName.replace(/\s+/g, '-');
}

function performMigrationUp(connections, migrationName) {
    var executableMigration = require(path.join(migrationDirectory, migrationName));
    
    // see if the migration has already been performed.  If so, skip it
    var db = connections[executableMigration.schema];
    return db.collection('migrations').findOneAsync({_id: migrationName})
        .then(function(migration) {
            if (migration) {
                // already applied
                return Promise.resolve();
            }
            console.log("Applying Migration: " + migrationName);
            return executableMigration.up(db)
                .then(function() {
                    return db.collection('migrations').insertOneAsync({_id: migrationName, applied: new Date() }); 
                });
        });
}

function performMigrationDown(connections, migrationName) {
    var executableMigration = require(path.join(migrationDirectory, migrationName));
    
    // see if the migration has already been performed.  If so, skip it
    var db = connections[executableMigration.schema];
    return db.collection('migrations').findOneAsync({_id: migrationName})
        .then(function(migration) {
            if (!migration) {
                // was never applied
                return Promise.resolve();
            }
            console.log("Reverting Migration: " + migrationName);
            return executableMigration.down(db)
                .then(function() {
                    return db.collection('migrations').deleteOneAsync({_id: migrationName });
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
    
    Promise.using(connection.connectToPlayerDatabase(), connection.connectToGameHistoryDatabase(), connection.connectToGameLibraryDatabase(), function(playerDb, historyDb, libraryDb) {
        var connections = {
            "player": playerDb,
            "gameHistory": historyDb,
            "gameLibrary": libraryDb
        };
        return Promise.each(migrationList, function(migration) {
           return migrationFunction(connections, migration); 
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
        '"use strict";',
        '',
        "exports.schema = ''; // 'player', 'gameLibrary', or 'gameHistory'",
        '',
        'exports.up = function(db) {',
        "    //return db.collection('foo').updateOneAsync({});",
        '};',
        '',
        'exports.down = function(db) {',
        "    //return db.collection('foo').deleteOneAsync({});",
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

    

