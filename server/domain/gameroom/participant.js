"use strict";

function Participant(player) {
	this._id = player._id;
	this.profile = {
		public: player.profile.public
	};
}

Participant.prototype.equals = function(otherParticipant) {
	return (this._id == otherParticipant._id);	
};

exports.adaptFromPlayer = function(player) {
	return new Participant(player);	
};