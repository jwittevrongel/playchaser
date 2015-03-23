"use strict";

exports.createMinionsForParticipant = function(participant) {
	participant.minions = [
	];

	for (var i = 0; i < 5; ++i) {
		for (var j = 0; j < 3; ++j) {
			participant.minions.push({
				color: participant.name,
				pips: j+1,
				location: { x: null, y: null },
				orientation: { direction: 'z', magnitude: 1 }
			});
		}
	}
	
	return participant;
};