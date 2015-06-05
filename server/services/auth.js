"use strict";

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Promise = require('bluebird'),
    identity = require('../domain/player/identity'),
    playerRepository = require('../db/repository/player'),
    connection = require('../db/connection');

// configure passport for local authentication
passport.use(new LocalStrategy(
    function(username, password, done) {
        return identity.createPlaychaserIdentity(username)
            .then(function(ident) {
                Promise.using(connection.connectToPlayerDatabase(), function(db) {
                    return playerRepository.open(db).loadSingleByIdentity(ident)
                        .then(function(player) {
                            if (!player) {
                                return false;
                            }
                            return player.identity.checkPassword(password)
                                .then(function(matched) {
                                    if (!matched) {
                                        return false;
                                    }
                                    return player;
                                });
                        }).nodeify(done);        
                });
        });
    }
));

// set up session serialization
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
    return Promise.using(connection.connectToPlayerDatabase(), function(db) {
            return playerRepository.open(db).loadSingleById(_id)
                .nodeify(done);
        });
});

// middleware to enforce authentication on requests
module.exports = function(req, res, next) {
    // enforce authentication for the request
    
    if (!req.user) {
    	// allow some interactions with /players to facilitate creating new accounts
        if (req.path == '/players') {
            if (req.method == 'POST') {
                return next();
            }
            if (req.method == 'GET' && req.query.hasOwnProperty('exists')) {
                return next();
            }
        } 
        
        // allow HEAD and OPTIONS
        if (req.method === 'HEAD' || req.method === 'OPTIONS') {
            return next();
        }
        
        // deny w/ 401    
        return res.status(401).end();
    }
    return next(); 
};
