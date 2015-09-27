"use strict";

var playerResource = require('../resources/player'),
    HttpStatus = require('http-status-codes'),
    ResourceError = require('../resources/error'),
    auth = require('../../services/auth'),
    rest = require('./rest');

exports.configureRoutes = function(app) {
    app.route('/players')
        // can't call wrapResourceJson since this is sorta custom....
		.post(function(req, res, next) {
			return playerResource.postPlayers(req.body)
                .then(function() {
                    next(); 
                })
                .catch(ResourceError, function(resErr) {
                    return res.status(resErr.status).json(resErr.detail).end();
                })
                .catch(function(e) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e).end(); 
                });
		}, auth.doLogin);
        
	app.route('/players/me')
        .get(function(req, res) {
            return rest.wrapResourceJson(res, playerResource.getPlayersMe(req.user));
        });
};

exports.configureAnonymousRoutes = function(app) {
    
    app.route('/players')
        // can get players - for now, presence / absence only to support async validation in signup page
        .get(function(req, res) {
            return rest.wrapResourceJson(res, playerResource.getPlayers(req.query).then(function(result) {
                // status only since we are anonymous here
                return { status: result.status };
            }));            
        });
};