"use strict";

var fs = require('fs'),
    path = require('path');

var baseDirectory = path.join(__dirname, '..', '..');
var relativeMigrationDirectory = path.join('db', 'migrations');
var absoluteMigrationDirectory = path.join(baseDirectory, relativeMigrationDirectory);

function padNumeral(numeral) {
    return Array(7 - numeral.toString().length).join('0') + numeral;
};

function makeNameFilename(migrationName) {
	return migrationName.replace(/\s+/g, '-');
};

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
    fs.writeFileSync(absoluteFileName, migrationTemplate, {mode: parseInt('0664', 8)});
    console.log("  Created Migration '" + path.join(relativeMigrationDirectory, fileName)); + "'";
};

    

