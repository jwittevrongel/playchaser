"use strict";

var TicTacToe = require('../../models/TicTacToe');

exports.configureRoutes = function(app) {
	app.route('games/tic-tac-toe')
		.post(function(req, res) {
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
				participants: [{name: '', player: req.user._id}, {name: ''}],
				moves: []
			});
			
			newGame.save(function(err) {
				if (err) {
					res.send(400, 'Cannot Create new Tic Tac Toe Game: ' + err);
				} else {
					res.location('games/tic-tac-toe/' + newGame.id);
					res.json(201, newGame.presentTo(req.user));
				}
			});
		});
};