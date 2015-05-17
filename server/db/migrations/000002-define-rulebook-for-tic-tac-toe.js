"use strict";

var rulebook = require('../../domain/gameroom/rulebook'),
    rulebookRepository = require('../repository/rulebook'),
	RULEBOOK_ID = 'tic-tac-toe';

exports.schema = rulebookRepository.schemaName;

exports.up = function(db) {
	var ticTacToe = rulebook.createRulebook(RULEBOOK_ID, 'Tic Tac Toe');
	ticTacToe.description = 'A 2-player game. Players take turns placing one of their markers in a 3x3 grid. A player wins by getting 3 markers in a line.';
	ticTacToe.participants = {
		min: 2,
		max: 2
	};
	var repo = rulebookRepository.open(db);
	return repo.save(ticTacToe);
};

exports.down = function(db) {
	var repo = rulebookRepository.open(db);
	return repo.removeById(RULEBOOK_ID);
};
