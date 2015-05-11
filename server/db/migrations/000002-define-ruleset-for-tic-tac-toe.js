"use strict";

var ruleset = require('../../domain/gameroom/ruleset'),
    rulesetRepository = require('../repository/ruleset'),
	RULESET_ID = 'tic-tac-toe';

exports.schema = rulesetRepository.schemaName;

exports.up = function(db) {
	var ticTacToe = ruleset.createRuleset(RULESET_ID, 'Tic Tac Toe');
	ticTacToe.description = 'A 2-player game. Players take turns placing one of their markers in a 3x3 grid. A player wins by getting 3 markers in a line.';
	ticTacToe.participants = {
		min: 2,
		max: 2
	};
	var repo = rulesetRepository.open(db);
	return repo.save(ticTacToe);
};

exports.down = function(db) {
	var repo = rulesetRepository.open(db);
	return repo.removeById(RULESET_ID);
};
