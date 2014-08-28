"use strict";

var path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Player = require('../models/Player');


var anonymousUrlPrefixes = [
	'/lib/',
	'/css/',
    '/font/',
    '/img',
    '/robots.txt',
    '/js/login.min.js', 
    '/login',
    '/js/environment.js',
    '/favicon.ico'
];

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

// set up session serialization
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  Player.findById(_id, function(err, user) {
    done(err, user);
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
        
        // allow a POST to /players to create a new account
        if (req.url == '/players' && req.method == 'POST') {
        	return next();
        }
                
        // if we got this far, we're not going to let them in         
        // decide whether to deny with a 401 or redirect (302) based on the request
        if ( ((req.method !== 'GET') && (req.method !== 'HEAD') && (req.method !== 'OPTIONS')) || (req.path.lastIndexOf('/api/', 0) === 0)) {
            res.send(401);
        } else {
            var extension = path.extname(req.url);
            if (extension !== '' && extension !== '.html') {
                res.send(401);
            } else {
            	if (req.url == '/index.html' || req.url == '/') {
                	res.redirect('login.html');
                } else {
                	res.redirect('login.html#/login?timeout');
                }	
            }
        }
        return; // stop the middleware chain here.
    }
    next(); 
};

module.exports.configureRoutes = function(app) {
	app.route('/login')
		.post(passport.authenticate('local', {
    		successRedirect: 'index.html',
    		failureRedirect: 'login.html#/login?tryagain'
		}));
		
	app.route('/players')
		.post(function(req, res) {
			// easy check - validate passwords match
			if (!req.body.password || req.body.password != req.body.repeatPassword) {
				return res.redirect('login.html#/signup?passwordmatch');
			}
			// check if there is a collision
			Player.findOne({idp: 'this', idpUsername: req.body.email}, function(err, player) {
				if (player) {
					return res.redirect('login.html#/signup?emailinuse');
				}
				Player.findOne({username: req.body.username}, function(err, player) {
					if (player) {
						return res.redirect('login.html#/signup?usernameinuse');
					}
					var theNewPlayer = new Player({
        				idp: "this",
						idpUsername: req.body.email,
						username: req.body.username,
						passwd: req.body.password,
						profile: {
							realName: req.body.username
						}
					});

					theNewPlayer.save(function (err) {
						if (err) {
							return res.redirect('login.html#/signup?playercreationerror');
						}
						passport.authenticate('local', {
							successRedirect: 'index.html#/player?new',
			 		   		failureRedirect: 'login.html#/signup?playercreationerror'
						})(req, res);
					});
				});	
			});
		});
};
