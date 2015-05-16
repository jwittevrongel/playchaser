"use strict";

var path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Promise = require('bluebird'),
    identity = require('../domain/player/identity'),
    playerRepository = require('../db/repository/player'),
    connection = require('../db/connection');

var anonymousUrlPrefixes = [
	'/lib/',
	'/css/',
    '/font/',
    '/img',
    '/robots.txt',
    '/js/login', 
    '/login',
    '/js/environment',
    '/favicon.ico'
];

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
    	// requests starting with these prefixes do not require the user
    	// to be logged in yet.
    	for (var i = 0; i < anonymousUrlPrefixes.length; ++i) {
			if (req.url.lastIndexOf(anonymousUrlPrefixes[i], 0) === 0) {
            	return next();
        	}
    	}
        
        // allow some interactions with /players to facilitate creating new accounts
        if (req.path == '/players') {
            if (req.method == 'POST') {
                return next();
            }
            if (req.method == 'GET' && req.query.hasOwnProperty('exists')) {
                return next();
            }
        } 
                
        // if we got this far, we're not going to let them in         
        // decide whether to deny with a 401 or redirect (302) based on the request
        if ( (req.method !== 'GET') && (req.method !== 'HEAD') && (req.method !== 'OPTIONS') ) {
            res.status(401).end();
        } else {
            var extension = path.extname(req.url);
            if (extension !== '.html') {
                res.status(401).end();
            } else {
            	if (req.url == '/index.html' || req.url == '/') {
                	res.redirect('/login.html');
                } else {
                	res.redirect('/login.html#/login?timeout');
                }	
            }
        }
        return; // stop the middleware chain here.
    }
    next(); 
};
