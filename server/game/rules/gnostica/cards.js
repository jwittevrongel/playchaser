"use strict";

var moveAction = function(/*target*/) {

};

var createAction = function(/*target*/) {

};

var growAction = function(/*target*/) {

};

var shrinkAction = function(/*target*/) {

};


var cards = {

};

for (var i = 1; i <= 10; ++i)
{
	var onePipMove = 'Move_' + i;
	cards[onePipMove] = {
		name: onePipMove,
		actions: [ moveAction ],
		bidValue: i,
		pointValue: 1
	};

	var onePipCreate = 'Create_' + i;
	cards[onePipCreate] = {
		name: onePipCreate,
		actions: [ createAction ],
		bidValue: i,
		pointValue: 1
	};

	var onePipGrow = 'Grow_' + i;
	cards[onePipGrow] = {
		name: onePipGrow,
		actions: [ growAction ],
		bidValue: i,
		pointValue: 1
	};

	var onePipShrink = 'Shrink_' + i;
	cards[onePipShrink] = {
		name: onePipShrink,
		actions: [ shrinkAction ],
		bidValue: i,
		pointValue: 1
	};
}

for (var j = 11; j <= 14; ++j) {
	var twoPipMove = 'Move_' + j;
	cards[twoPipMove] = {
		name: twoPipMove,
		actions: [ moveAction ],
		bidValue: j,
		pointValue: 2
	};

	var twoPipCreate = 'Create_' + j;
	cards[twoPipCreate] = {
		name: twoPipCreate,
		actions: [ createAction ],
		bidValue: j,
		pointValue: 2
	};

	var twoPipGrow = 'Grow_' + j;
	cards[twoPipGrow] = {
		name: twoPipGrow,
		actions: [ growAction ],
		bidValue: j,
		pointValue: 2
	};

	var twoPipShrink = 'Shrink_' + j;
	cards[twoPipShrink] = {
		name: twoPipShrink,
		actions: [ shrinkAction ],
		bidValue: j,
		pointValue: 2
	};
}

var foolAction = function() {
	// draw a card and use it
};
cards.Fool_0 = {
	name: 'Fool_0',
	actions: [ foolAction, foolAction ],
	bidValue: 15,
	pointValue: 3
};

var magicianAction = function() {
	// choose 1 of the 4 basic actions
};
cards.Magician_1 = {
	name: 'Magician_1',
	actions: [ magicianAction ],
	bidValue: 16,
	pointValue: 3
};

module.exports = cards;