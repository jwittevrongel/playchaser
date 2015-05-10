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

var repository = require('./');

var PlayerRepository = repository.generate(SCHEMA, COLLECTION, INDEXES);
	
PlayerRepository.prototype.save = function(player) {
	return this._collection.updateOneAsync({
		"identity.idp": player.identity.idp, 
		"identity.idpUsername": player.identity.idpUsername
	}, player, { upsert: true });
};

PlayerRepository.prototype.removeByIdentity = function(identity) {
	return this._collection.deleteOneAsync({
		"identity.idp": identity.idp,
		"identity.idpUsername": identity.idpUsername
	});
};

module.exports = repository.generateExports(PlayerRepository);

