"use strict";

var SCHEMA = 'player',
    COLLECTION = 'players',
	INDEXES = [{
		key: {
			"identity.idp": 1,
			"identity.idpUsername": 1
		},
		name: "player_ux01_identity",
		unique: true
	}, {
		key: {
			"profile.public.moniker": 1
		},
		name: "player_ux02_moniker",
		unique: true
		
	}];

var repository = require('./'),
	mongodb = require('mongodb'),
	player = require('../../domain/player');

var PlayerRepository = repository.generateMongoRepository(SCHEMA, COLLECTION, INDEXES);

PlayerRepository.prototype.save = function(player) {
	return this._collection.updateOneAsync({
		"identity.idp": player.identity.idp, 
		"identity.idpUsername": player.identity.idpUsername
	}, player, { upsert: true })
	.then(function() {
		return player;	
	});
};

PlayerRepository.prototype.removeByIdentity = function(identity) {
	return this._collection.deleteOneAsync({
		"identity.idp": identity.idp,
		"identity.idpUsername": identity.idpUsername
	}).then(function() {
		return true;	
	});
};

PlayerRepository.prototype.loadSingleById = function(id) {
	return this.hydrateOne(player.create, this._collection.findOneAsync({ 
		"_id" : new mongodb.ObjectID(id) 
	}));
};

PlayerRepository.prototype.loadSingleByIdentity = function(identity) {
	return this.hydrateOne(player.create, this._collection.findOneAsync({
		"identity.idp": identity.idp,
		"identity.idpUsername": identity.idpUsername
	}));
};

PlayerRepository.prototype.loadSingleByMoniker = function(moniker) {
	return this.hydrateOne(player.create, this._collection.findOneAsync({
		"profile.public.moniker": moniker
	}));
};

module.exports = repository.generateMongoExports(PlayerRepository);

