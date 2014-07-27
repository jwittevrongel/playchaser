"use strict";

var TicTacToe = require('../../models/TicTacToe');

exports.configureRoutes = function(app) {
	app.route('games/tic-tac-toe')
		.get(function(req, res) {
			
		});
};