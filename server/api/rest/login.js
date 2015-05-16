"use strict";

var passport = require('passport');

exports.configureRoutes = function(app) {
	app.route('/login')
		.post(passport.authenticate('local'), function(req, res) {
            res.status(200).send({ href: 'index.html' });
        });
};