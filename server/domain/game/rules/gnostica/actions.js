"use strict";


var actions = {

};

// actions that don't require a card to invoke
actions.placeFirstMinion = function(/*target*/) {

};

actions.orientMinion = function(/*target*/) {

};

actions.discardAndDraw = function(/*cards*/) {

};

// core 4 actions
var coreMoveAction = function(limit) {
	return function(/*target*/) {
		return limit; // derp
	};
};
actions.move = coreMoveAction(3);
actions.moveUnlimited = coreMoveAction(0);

var coreCreateAction = function(limit) {
	return function(/*target*/) {
		return limit; // derp
	};
};
actions.create = coreCreateAction(3);
actions.createUnlimited = coreCreateAction(0);

actions.grow = function(/*target*/) {

};

actions.shrink = function(/*target*/) {

};

// fool
actions.drawAndUseACard = function(/*target*/) {

};

// magician
actions.oneOfTheCoreFour = function(/*target*/) {

};

// hierophant
actions.convertEnemyMinionToPlayersColor = function(/*target*/) {

};

// hermit
actions.teleport = function(/*target*/) {

};

// wheel of fortune
actions.createAllowRandomTerritory = function(/*target*/) {

};

module.exports = actions;