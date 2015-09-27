"use strict";

var tableResource = require('../resources/table'),
    rest = require('./rest');

exports.configureRoutes = function(app) {
    // app.route('/tables/:rulebook/:id') 
    //     .get(function(req, res) { // get specific table
    //         // return rest.wrapResourceJson(res, rulebookResource.get(req.params.id));
    //     });
	// app.route('/tables/:rulebook') 
	// 	.get(function(req, res) { // list public tables for a particular rulebook, can be queried
    //         // return rest.wrapResourceJson(res, rulebookResource.getAll());
	// 	})
	// 	.post(function(req, res) { // create new table
	// 		
	// 	});
	app.route('/tables')
		// .get(function(req, res) { // list public tables.  can be queried.
		// 	
		// })
		.post(function(req, res) {
			return rest.wrapResourceJson(res, tableResource.postTables(req.body, req.user, req.path));
		});
};