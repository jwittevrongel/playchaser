"use strict";

var TicTacToe = require('../../models/TicTacToe');

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