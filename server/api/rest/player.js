"use strict";

var playerResource = require('../resources/player'),
    HttpStatus = require('http-status-codes'),
    ResourceError = require('../resources/error'),
    auth = require('../../services/auth');

exports.configureRoutes = function(app) {
    app.route('/players')
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
            return playerResource.getPlayersMe(req)
                .then(function(result) {
                   return res.status(result.status).json(result.value); 
                })
                .catch(function(e) {
                   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e); 
                });
        });
};

exports.configureAnonymousRoutes = function(app) {
    
    app.route('/players')
        // can get players - for now, presence / absence only to support async validation in signup page
        .get(function(req, res) {
            return playerResource.getPlayers(req.query)
                .then(function(result) {
                    res.status(result.status).send();
                })
                .catch(ResourceError, function(resErr) {
                   res.status(resErr.status).json(resErr.detail); 
                })
                .catch(function(e) {
                   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e); 
                });
        });
};