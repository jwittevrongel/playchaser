"use strict";

var cardDefinitions = require('./cards'),
	shuffle = require('knuth-shuffle').knuthShuffle;

exports.create = function(req, res) {
	// shuffle cards
	var deckOfCards = [];
	for (var card in cardDefinitions) {
    	if (cardDefinitions.hasOwnProperty(card)) {
        	deckOfCards.push(cardDefinitions[card]);
    	}
    }
    deckOfCards = shuffle(deckOfCards);

	res.status(201);
};