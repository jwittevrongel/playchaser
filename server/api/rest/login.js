"use strict";

var auth = require('../../services/auth');
 
exports.configureRoutes = function(app) {
	app.route('/login')
		.post(auth.doLogin);
};