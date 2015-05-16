"use strict";

var playerResource = require('../resources/player'),
    HttpStatus = require('http-status-codes'),
    ResourceError = require('../resources/error'),
    passport = require('passport');

exports.configureRoutes = function(app) {
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
		}, passport.authenticate('local'), function(req, res) {
            res.status(HttpStatus.CREATED).send({ href: 'index.html#/profile' });
        })

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