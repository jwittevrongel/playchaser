"use strict";

exports.schema = 'gameLibrary';

exports.up = function(db) {
	return db.collection('rulesets').updateOneAsync({_id: 'tic-tac-toe'}, {
		name: 'Tic Tac Toe',
		description: 'A 2-player game. Players take turns placing one of their markers in a 3x3 grid. A player wins by getting 3 markers in a line.',
		variants:[],
		participants: {
			min: 2,
			max: 2
		}
	}, { upsert: true });
};

exports.down = function(db) {
	return db.collection('rulesets').deleteOneAsync({_id: 'tic-tac-toe'});
};
