"use strict";

var nconf = require('nconf');

nconf.argv()
     .env()
     .file('site', __dirname + '/site.json')
     .file('application', __dirname + '/application.json');

exports.port = nconf.get('port');
exports.db = nconf.get('db');
exports.initialSetup = nconf.get('initialSetup');
exports.session = nconf.get('session');