"use strict";

var RuleSet = require('../../models/RuleSet');

exports.up = function(mongoose, next) {
	var ticTacToeRuleSet = new RuleSet({
		_id: 'tic-tac-toe',
		name: 'Tic Tac Toe',
		description: 'A 2-player game. Players take turns placing one of their markers in a 3x3 grid. A player wins by getting 3 markers in a line.',
		variants:[],
		participants: {
			min: 2,
			max: 2
		}
	});
	
	ticTacToeRuleSet.save(function(err) {
		next(err);
	});
};

exports.down = function(mongoose, next) {
	RuleSet.remove({_id: 'tic-tac-toe'}, function(err) {
		next(err);
	});
};
