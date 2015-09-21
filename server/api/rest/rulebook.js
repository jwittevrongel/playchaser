"use strict";

var rulebookResource = require('../resources/rulebook'),
    rest = require('./rest');

exports.configureRoutes = function(app) {
    app.route('/rulebooks/:id')
        .get(function(req, res) {
            return rest.wrapResourceJson(res, rulebookResource.get(req.params.id));
        });
	app.route('/rulebooks')
		.get(function(req, res) {
            return rest.wrapResourceJson(res, rulebookResource.getAll());
		});
};