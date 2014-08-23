"use strict";

exports.configureRoutes = function(app) {
	app.route('/js/environment.js').get(function(req, res) {
		var urlSuffix = (req.connection.encrypted ? 's' : '') + '://' + req.headers.host + '/';

		res.type('.js');
		res.end(
			'(function(angular){' +
			'"use strict";' + 
			'angular.module("playchaser")' +
			'.constant("pcEnvironment", {' +
			'restRoot: "http' + urlSuffix + '", ' +
			'wsRoot: "ws' + urlSuffix + '"});})(angular);');
	});
};