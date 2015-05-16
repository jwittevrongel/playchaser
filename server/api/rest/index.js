"use strict";

var path = require('path'),
    fs = require('fs');
	
var basename = path.basename(__filename);

module.exports.configureRoutes = function(app) {
	fs.readdirSync(__dirname).forEach(function(file) {
		if (file !== basename && path.extname(file) === '.js') {
			var routes = require('./' + path.basename(file, '.js'));
			routes.configureRoutes(app);
		}
	});
};