"use strict";

var nconf = require('nconf');

nconf.argv()
     .env()
     .file('site', 'config/site.json')
     .file('application', 'config/application.json');

exports.port = nconf.get('port');
exports.db = nconf.get('db');
exports.initialSetup = nconf.get('initialSetup');
exports.session = nconf.get('session');