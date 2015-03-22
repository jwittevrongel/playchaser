"use strict";

var TicTacToe = require('../../../models/TicTacToe'),
	game      = require('../..');

exports.model = TicTacToe;

exports.create = function(req, res) {
	var newGame = new TicTacToe({
		owner: req.user._id,
		rules: 'tic-tac-toe',
		currentState: {
			global: { public: { board: {
				"0": {"0": "", "1": "", "2": ""},
				"1": {"0": "", "1": "", "2": ""},
				"2": {"0": "", "1": "", "2": ""}
			}}}
		},
		participants: [{name: '', player: req.user._id}],
		moves: []
	});
	
	newGame.save(function(err) {
		if (err) {
			res.status(400).send('Cannot Create new Tic Tac Toe Game: ' + err);
		} else {
			res.location('games/tic-tac-toe/' + newGame.id);
			res.status(201).json(newGame.presentTo(req.user));
		}
	});
};

exports.start = function(req, res) {
	req.game.currentState.stanza = 'game-on';

	// fornow: always assign paricipants randomly to X or O
	game.randomizeParticipants(req.game, [
		{
			name: 'X',
			turnOrder: 0,
			tablePosition: 0
		},
		{
			name: 'O',
			turnOrder: 1,
			tablePosition: 1
		}
	]);

	req.game.save(function(err) {
		if (err) {
			res.status(400).send('Cannot start Tic Tac Toe game:' + err);
		} else {
			res.status(200).send(req.game.presentTo(req.user));
		}
	});
};