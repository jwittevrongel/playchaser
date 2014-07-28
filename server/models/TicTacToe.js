"use strict";

var BaseGameSchema = require('./BaseGameSchema'),
    Game = require('./Game');

var TicTacToeBoardSchema = {
	board: {
		"0": {"0": String, "1": String, "2": String},
		"1": {"0": String, "1": String, "2": String},
		"2": {"0": String, "1": String, "2": String}
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