"use strict";

function Participant(playerOrParticipant) {
	this._id = playerOrParticipant._id;
	if (playerOrParticipant.profile) {
		this.profile = { public : playerOrParticipant.profile.public };
	} else {
		this.profile = { public: { } };
	}
}

Participant.prototype.equals = function(otherParticipant) {
	return (this._id == otherParticipant._id);	
};

exports.create = function(playerOrParticipant) {
	return new Participant(playerOrParticipant);	
};