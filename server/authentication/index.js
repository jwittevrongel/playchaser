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
    '/js/login.min', 
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
                return done(null, false, { src: 'login', err: 'userpass', message: 'Incorrect username or password.' });
            }
            player.checkPassword(password, function(err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, player);
                } else {
                    return done(null, false, { src: 'login', err: 'userpass', message: 'Incorrect username or password.' });
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
            if (extension !== '' && extension !== '.html') {
                res.status(401).end();
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
		.post(
            passport.authenticate('local'), 
            function(req, res) {
                res.status(200).send({ href: 'index.html' });
            }
        );
		
	app.route('/players')
		.post(function(req, res, next) {
			// easy check - validate passwords match
			if (!req.body.password || req.body.password != req.body.repeatPassword) {
				return res.status(400).send({src: 'signup', err: 'passwordmatch', message: 'The supplied passwords do not match.'});
			}
			// check if there is a collision
			Player.findOne({idp: 'this', idpUsername: req.body.username}, function(err, player) {
				if (player) {
					return res.status(400).send({ src: 'signup', err: 'emailinuse', message: 'There is already an account registered with that e-mail address.'});
				}
				Player.findOne({username: req.body.uniqueName}, function(err, player) {
					if (player) {
						return res.status(400).send({ src: 'signup', err: 'usernameinuse', message: 'There is already an account registered with that username.'});
					}
					var theNewPlayer = new Player({
        				idp: "this",
						idpUsername: req.body.username,
						username: req.body.uniqueName,
						passwd: req.body.password,
						profile: {
							realName: req.body.uniqueName
						}
					});

					theNewPlayer.save(function (err) {
						if (err) {
							return res.status(500).send({ src: 'server', err: 'unspecified', message: 'There was an error creating your account. Try again later.'});
						}
						passport.authenticate('local', function(err, user) {
                            if (err || !user) {
                                return res.status(500).send({ src: 'server', err: 'unspecified', message: 'There was an error creating your account. Try again later.'});
                            }
                            req.login(user, function() {
                                return res.status(200).send({ href: 'index.html#/player?new' });    
                            });
                        })(req, res, next);
					});
				});	
			});
		})

        // can get players - for now, presence / absence only to support async validation in signup page
        .get(function(req, res) {
            if (req.query.hasOwnProperty('exists')) {
                if (req.query.uniqueName) {
                    Player.findOne({username: req.query.uniqueName}, function(err, player) {
                        if (player) {
                            return res.status(200).send();
                        }
                        return res.status(404).send();
                    });
                }

                else if (req.query.username) {
                    Player.findOne({idp: 'this', idpUsername: req.query.username}, function(err, player) {
                        if (player) {
                            return res.status(200).send();
                        } 
                        return res.status(404).end();
                    });
                }
                else {
                    return res.status(400).end();
                }
            }
            else {
                return res.status(403).send();
            }
        });
};
