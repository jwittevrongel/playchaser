"use strict";

var tableResource = require('../resources/table'),
    rest = require('./rest'),
	_ = require('lodash');

exports.configureRoutes = function(app) {
    // app.route('/tables/:rulebook/:id') 
    //     .get(function(req, res) { // get specific table
    //         // return rest.wrapResourceJson(res, rulebookResource.get(req.params.id));
    //     });
	app.route('/tables/:rulebook') 
	 	.get(function(req, res) { // list public tables for a particular rulebook, can be queried
			return rest.wrapResourceJson(res, tableResource.getTables(_.merge({rulebook : req.params.rulebook}, req.query), req.user));
		})
	 	.post(function(req, res) { // create new table for rulebook without a post body
	 		var syntheticRequest = { rulebook: {_id: req.params.rulebook }};
			return rest.wrapResourceJson(res, tableResource.postTables(syntheticRequest, req.user, req.path)); 
	 	});
	app.route('/tables')
		.get(function(req, res) { // list of tables
			return rest.wrapResponseJson(res, tableResource.getTables(req.query, req.user));
		})
		.post(function(req, res) {
			return rest.wrapResourceJson(res, tableResource.postTables(req.body, req.user, req.path));
		});
};