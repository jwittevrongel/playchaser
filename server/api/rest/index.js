"use strict";

var path = require('path'),
    fs = require('fs');
	
var basename = path.basename(__filename);

function configure(functionName, app) {
	fs.readdirSync(__dirname).forEach(function(file) {
		if (file !== basename && path.extname(file) === '.js') {
			var routes = require('./' + path.basename(file, '.js'));
			if (typeof routes[functionName] === 'function') {
				routes[functionName](app);
			}
		}
	});
}

['configureRoutes', 'configureAnonymousRoutes'].forEach(function(functionName) {
	exports[functionName] = function(app) {
		return configure(functionName, app);
	};
});


