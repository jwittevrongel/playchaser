"use strict";

var BaseGameSchema = require('./BaseGameSchema'),
    Game = require('./Game');

var TicTacToeBoardSchema = {
	board: {
		"0": {"0": Number, "1": Number, "2": Number},
		"1": {"0": Number, "1": Number, "2": Number},
		"2": {"0": Number, "1": Number, "2": Number}
	}
};

var TicTacToeActionSchema = {
	mark: { row: Number, col: Number }
};

var TicTacToeSchema = new BaseGameSchema();

TicTacToeSchema.setActionType(TicTacToeActionSchema);
TicTacToeSchema.setStateTypes({
	global: { 
		public: TicTacToeBoardSchema
	}
});

module.exports = Game.discriminator("TicTacToe", TicTacToeSchema);