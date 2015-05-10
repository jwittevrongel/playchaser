"use strict";

var config = require('../../config'),
    player = require('../../domain/player'),
    identity = require('../../domain/player/identity'),
    playerRepository = require('../repository/player'),
    ADMIN_EMAIL_ADDRESS = 'administrator@playchaser.com';
    
exports.schema = playerRepository.schemaName;

exports.up = function(db) {
    var adminPassword = config.initialSetup.adminPassword;
    if (!adminPassword) {
        throw '*** Error: initialSetup.adminPassword was not set in site.json';
    }
    return identity.createPlaychaserIdentity(ADMIN_EMAIL_ADDRESS, adminPassword)
        .then(function(identity) {
            var adminPlayer = player.createPlayer(identity);
            adminPlayer.profile.public.moniker = 'PlaychaserAdmin';
            adminPlayer.profile.public.name = "Playchaser Administrator";
            var repo = playerRepository.open(db);
            return repo.save(adminPlayer);
        });
    
};

exports.down = function(db) {
    return identity.createPlaychaserIdentity(ADMIN_EMAIL_ADDRESS)
        .then(function(identity) {
            var repo = playerRepository.open(db);
            return repo.removeByIdentity(identity);
        });
};
