"use strict";

var identity = require ('./identity');

function Player() {
    this.identity = identity.create();
    this.profile = { public: {}, private: {} };
}

Player.prototype.isValid = function() {
    return this.identity.isValid();
};

exports.createPlayer = function(identity) {
    if (!identity) {
        throw new Error("must provide identity");
    }
    var player = new Player();
    player.identity = identity;
    if (player.identity.isPlaychaser()) {
        player.profile.private.emailAddress = identity.idpUsername;
    }
    return player;
};

exports.create = function() {
    return new Player();
};
 

