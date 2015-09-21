"use strict";

var _ = require('lodash'),
    ResourceError = require('./error'),
	Promise = require('bluebird'),
	HttpStatus = require('http-status-codes'),
	playerRepository = require('../../db/repository/player'),
	connection = require('../../db/connection'),
	player = require('../../domain/player'),
	identity = require('../../domain/player/identity'),
	resource = require('./');

var presenters = {
	publicProfile: function(player) {
		var presented = this.entirePlayer(player);
		delete presented.identity;
		delete presented.profile.private;
		return presented;
	},
	entirePlayer: function(player) {
		var presented = _.merge({}, player);
		delete presented._id;
		delete presented.identity.passwd;
		return presented;
	}
};

exports.getPlayersMe = function(httpContext) {
	return Promise.resolve({ status: HttpStatus.OK, value: presenters.entirePlayer(httpContext.user) });
};

exports.getPlayers = function(getPlayersQueryParams) {
	if (getPlayersQueryParams.hasOwnProperty('exists')) {
        if (getPlayersQueryParams.moniker) {
			return Promise.using(connection.connectToPlayerDatabase(), function(db) {
				var repos = playerRepository.open(db);
				return repos.loadSingleByMoniker(getPlayersQueryParams.moniker)
					.then(function(player) {
						if (player) {
							return { status: HttpStatus.OK, value: {}};
						}
						return { status: HttpStatus.NOT_FOUND, value: {}};
					});
			});
		}
		
		if (getPlayersQueryParams.username) {
			return Promise.using(connection.connectToPlayerDatabase(), function(db) {
				var repos = playerRepository.open(db);
				return identity.createPlaychaserIdentity(getPlayersQueryParams.username)
					.then(function(id) {
						return repos.loadSingleByIdentity(id);
					})
					.then(function(player) {
						if (player) {
							return { status: HttpStatus.OK, value: {}};
						}
						return { status: HttpStatus.NOT_FOUND, value: {}};
					});
			});
		}
        return Promise.resolve({ status: HttpStatus.BAD_REQUEST, value: {}});
    }
    else {
        return Promise.resolve({ status: HttpStatus.FORBIDDEN, value: {}});
    }
};

exports.postPlayers = function(newPlayerRequest) {	
	// validate input parameters
	if (!newPlayerRequest.username) {
		return Promise.reject(new ResourceError(HttpStatus.BAD_REQUEST, {
			src: 'signup',
			err: 'usernameNotSupplied',
			message: 'Username was not provided.' 
		}));
	}
	if (!newPlayerRequest.moniker) {
		return Promise.reject(new ResourceError(HttpStatus.BAD_REQUEST, {
			src: 'signup',
			err: 'monikerNotSupplied',
			message: 'Moniker was not provided.' 
		}));
	}
	if (!newPlayerRequest.password || newPlayerRequest.password != newPlayerRequest.repeatPassword) {
		return Promise.reject(new ResourceError(HttpStatus.BAD_REQUEST, {
			src: 'signup',
			err: 'passwordMatch',
			message: 'The supplied passwords do not match.' 
		}));
	}
	
	return Promise.using(connection.connectToPlayerDatabase(), function(db) {
		var repos = playerRepository.open(db);
		var newIdentity;
		return resource.created(identity.createPlaychaserIdentity(newPlayerRequest.username, newPlayerRequest.password)
			.then(function(id) {
				newIdentity = id;
				return repos.loadSingleByIdentity(id);
			})
			.then(function(player) {
				if (player) {
					throw new ResourceError(HttpStatus.BAD_REQUEST, {
						src: 'signup', 
						err: 'emailinuse', 
						message: 'There is already an account registered with that e-mail address.'
					});
				}
				return repos.loadSingleByMoniker(newPlayerRequest.moniker);
			})
			.then(function(player) {
				if (player) {
					throw new ResourceError(HttpStatus.BAD_REQUEST, {
						src: 'signup', 
						err: 'monikerinuse', 
						message: 'There is already an account registered with that moniker.'
					});
				}
			})
			.then(function() {
				var newPlayer = player.createPlayer(newIdentity);
				newPlayer.profile.public.moniker = newPlayerRequest.moniker;
				return repos.save(newPlayer);
			}));
	});
};

