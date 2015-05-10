"use strict";

function Player() {
    this.identity = { };
    this.profile = { public: {}, private: {} };
}

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
 

