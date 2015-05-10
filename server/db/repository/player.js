"use strict";

exports.schemaName = 'player';
exports.collectionName = 'players';

function PlayerRepository(db) {
	this.db = db;
	this.collection = db.collection(exports.collectionName);
}

PlayerRepository.prototype.save = function(player) {
	return this.collection.updateOneAsync({
		"identity.idp": player.identity.idp, 
		"identity.idpUsername": player.identity.idpUsername
	}, player, { upsert: true });
};

PlayerRepository.prototype.removeByIdentity = function(identity) {
	return this.collection.deleteOneAsync({
		"identity.idp": identity.idp,
		"identity.idpUsername": identity.idpUsername
	});
};

PlayerRepository.prototype.initializeIndices = function() {
	var self = this;
	return self.collection.createIndexesAsync([{
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
		
	}]);
};

PlayerRepository.prototype.dropIndices = function() {
	return this.collection.dropIndexesAsync();
};

exports.open = function(db) {
	return new PlayerRepository(db);	
};

