"use strict";

var path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Player = require('../../models/Player');

// configure passport for local authentication
passport.use(new LocalStrategy(
    function(username, password, done) {
        Player.findOne({ idp: 'this', idpUsername: username }, function (err, player) {
            if (err) { 
                return done(err); 
            }
            if (!player) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            player.checkPassword(password, function(err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, player);
                } else {
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
            });
        });
    }
));


// middleware to enforce authentication on requests
module.exports = function(req, res, next) {
    // enforce authentication for the request
    if (!req.user) {
        // some URL prefixes are exempt - anything in lib and in css is OK without auth
        if (req.path.lastIndexOf('/lib/', 0) === 0) {
            return next();
        }
        if (req.path.lastIndexOf('/css/', 0) === 0) {
            return next();
        }
 
        // allow user access to login / logout routes
        var allowedPaths = ['/favicon.ico', 'robots.txt', '/login', '/js/login.js'];
        for (var i = 0; i < allowedPaths.length; ++i) {
            if (req.path === allowedPaths[i]) {
                return next();
            }
        }
                
        // if we got this far, we're not going to let them in         
        // decide whether to deny with a 401 or redirect (302) based on the request
        if ( ((req.method !== 'GET') && (req.method !== 'HEAD') && (req.method !== 'OPTIONS')) || (req.path.lastIndexOf('/api/', 0) === 0)) {
            res.send(401);
        } else {
            var extension = path.extname(req.path);
            if (extension !== '' && extension !== '.html') {
                res.send(401);
            } else {
                res.redirect('/login');
            }
        }
        return; // stop the middleware chain here.
    }
    next(); 
};