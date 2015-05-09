"use strict";

var actions = require('./actions');

var cards = {

};

for (var i = 1; i <= 10; ++i)
{
	var onePipMove = 'Move_' + i;
	cards[onePipMove] = {
		name: onePipMove,
		actions: [ actions.move ],
		bidValue: i,
		pointValue: 1
	};

	var onePipCreate = 'Create_' + i;
	cards[onePipCreate] = {
		name: onePipCreate,
		actions: [ actions.create ],
		bidValue: i,
		pointValue: 1
	};

	var onePipGrow = 'Grow_' + i;
	cards[onePipGrow] = {
		name: onePipGrow,
		actions: [ actions.grow ],
		bidValue: i,
		pointValue: 1
	};

	var onePipShrink = 'Shrink_' + i;
	cards[onePipShrink] = {
		name: onePipShrink,
		actions: [ actions.shrink ],
		bidValue: i,
		pointValue: 1
	};
}

for (var j = 11; j <= 14; ++j) {
	var twoPipMove = 'Move_' + j;
	cards[twoPipMove] = {
		name: twoPipMove,
		actions: [ actions.move ],
		bidValue: j,
		pointValue: 2
	};

	var twoPipCreate = 'Create_' + j;
	cards[twoPipCreate] = {
		name: twoPipCreate,
		actions: [ actions.create ],
		bidValue: j,
		pointValue: 2
	};

	var twoPipGrow = 'Grow_' + j;
	cards[twoPipGrow] = {
		name: twoPipGrow,
		actions: [ actions.grow ],
		bidValue: j,
		pointValue: 2
	};

	var twoPipShrink = 'Shrink_' + j;
	cards[twoPipShrink] = {
		name: twoPipShrink,
		actions: [ actions.shrink ],
		bidValue: j,
		pointValue: 2
	};
}

cards.Fool_0 = {
	name: 'Fool_0',
	actions: [ actions.drawAndUseACard, actions.drawAndUseACard ],
	bidValue: 15,
	pointValue: 3
};

cards.Magician_1 = {
	name: 'Magician_1',
	actions: [ actions.oneOfTheCoreFour ],
	bidValue: 16,
	pointValue: 3
};

cards.High_Priestess_2 = {
	name: 'High_Priestess_2',
	actions: [ actions.discardAndDraw, actions.discardAndDraw ],
	bidValue: 17,
	pointValue: 3
};

cards.Empress_3 = {
	name: 'Empress_3',
	actions: [ actions.orientMinion, actions.createUnlimited ],
	bidValue: 18,
	pointValue: 3
};

cards.Emperor_4 = {
	name: 'Emperor_4',
	actions: [ actions.orientMinion, actions.moveUnlimited ],
	bidValue: 19,
	pointValue: 3
};

cards.Hierophant_5 = {
	name: 'Hierophant_5',
	actions: [ actions.convertEnemyMinionToPlayersColor ],
	bidValue: 20,
	pointValue: 3
};

cards.Lovers_6 = {
	name: 'Lovers_6',
	actions: [ actions.move, actions.create ],
	bidValue: 21,
	pointValue: 3
};

cards.Chariot_7 = {
	name: 'Chariot_7',
	actions: [ actions.move, actions.move ],
	bidValue: 22,
	pointValue: 3
};

cards.Strength_8 = {
	name: 'Strength_8',
	actions: [ actions.grow, actions.grow ],
	bidValue: 23,
	pointValue: 3
};

cards.Hermit_9 = {
	name: 'Hermit_9',
	actions: [ actions.teleport ],
	bidValue: 24,
	pointValue: 3
};

cards.Wheel_of_Fortune_10 = {
	name: 'Wheel_of_Fortune_10',
	actions: [ actions.createAllowRandomTerritory ],
	bidValue: 25,
	pointValue: 3
};

module.exports = cards;