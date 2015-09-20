"use strict";

var rulebookResource = require('../resources/rulebook'),
	HttpStatus = require('http-status-codes');

exports.configureRoutes = function(app) {
	app.route('/rulebooks')
		.get(function(req, res) {
			return rulebookResource.getAll()
                .then(function(result) {
                   return res.status(result.status).json(result.value); 
                })
                .catch(function(e) {
                   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e); 
                });
		});
};