"use strict";

var fs = require('fs');
var nconf = require('nconf'),
	clientEnvironment = require('./clientEnvironment');

var endsWith = function(toSearch, suffix) {
    return toSearch.indexOf(suffix, toSearch.length - suffix.length) !== -1;
};

nconf.argv()
     .env()
     .file('site', __dirname + '/site.json')
     .file('application', __dirname + '/application.json');

exports.port = nconf.get('port');
exports.db = nconf.get('db');
exports.initialSetup = nconf.get('initialSetup');
exports.session = nconf.get('session');
var secure = nconf.get('secure');

for (var key in secure) {
	if (endsWith(key, 'File')) {
		secure[key.substring(0, key.length - 4)] = fs.readFileSync(__dirname + '/' + secure[key]);
		delete secure[key];
	}
}

exports.secure = secure;
exports.clientEnvironment = clientEnvironment;