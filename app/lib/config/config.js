"use strict";

var nconf = require('nconf');

nconf.argv()
     .env()
     .file('../../config/site.json')
     .file('../../config/application.json');
     
exports.db = nconf.get("db");
exports.initialSetup = nconf.get("initialSetup");
