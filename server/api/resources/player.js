"use strict";

var _ = require('lodash'),
    ResourceError = require('./error'),
	ResourceResult = require('./result'),
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

exports.getPlayersMe = function(me) {
	return Promise.resolve({ status: HttpStatus.OK, value: presenters.entirePlayer(me) });
};

exports.getPlayers = function(getPlayersQueryParams) {
	if (getPlayersQueryParams.hasOwnProperty('exists')) {
        if (getPlayersQueryParams.moniker) {
			return Promise.using(connection.connectToPlayerDatabase(), function(db) {
				var repos = playerRepository.open(db);
				return repos.findByMoniker(getPlayersQueryParams.moniker)
					.then(function(player) {
						if (player) {
							return new ResourceResult(HttpStatus.OK, {});
						}
						return new ResourceResult(HttpStatus.NOT_FOUND, {});
					});
			});
		}
		
		if (getPlayersQueryParams.username) {
			return Promise.using(connection.connectToPlayerDatabase(), function(db) {
				var repos = playerRepository.open(db);
				return identity.createPlaychaserIdentity(getPlayersQueryParams.username)
					.then(function(id) {
						return repos.findByIdentity(id);
					})
					.then(function(player) {
						if (player) {
							return new ResourceResult(HttpStatus.OK, {});
						}
						return new ResourceResult(HttpStatus.NOT_FOUND, {});
					});
			});
		}
        return Promise.resolve(new ResourceResult(HttpStatus.BAD_REQUEST, {}));
    }
    else {
        return Promise.resolve(new ResourceResult(HttpStatus.FORBIDDEN, {}));
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
				return repos.findByIdentity(id);
			})
			.then(function(player) {
				if (player) {
					throw new ResourceError(HttpStatus.BAD_REQUEST, {
						src: 'signup', 
						err: 'emailinuse', 
						message: 'There is already an account registered with that e-mail address.'
					});
				}
				return repos.findByMoniker(newPlayerRequest.moniker);
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

