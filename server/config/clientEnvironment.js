"use strict";

exports.configureRoutes = function(app) {
	app.route('/js/environment.js').get(function(req, res) {
		var connectionIsEncrypted = req.connection.encrypted || req.get('X-Forwarded-Proto') === 'https';
		var urlSuffix = (connectionIsEncrypted ? 's' : '') + '://' + req.headers.host + '/';

		res.type('.js');
		res.end(
			'(function(angular){' +
			'"use strict";' + 
			'angular.module("playchaser.environment", [])' +
			'.constant("pcEnvironment", {' +
			'site: {' +
			'restRoot: "http' + urlSuffix + '",' +
			'wsRoot: "ws' + urlSuffix + '"' + 
			'}});})(angular);');
	});
};