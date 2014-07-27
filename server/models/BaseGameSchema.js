"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    util = require('util');

var GameParticipantSchema = {
	name: {type: String, required: true},
	player: {type: Schema.Types.ObjectId, ref : 'Player'}
};

var GameStateSchema = {
};

var GameStateContainerSchema = {
	currentTurn: GameParticipantSchema,
	global: GameStateSchema,
	perParticipant: [{participant: GameParticipantSchema, state: GameStateSchema}]
};

var GameActionSchema = {
	initiator: GameParticipantSchema
};

var GameTurnSchema = {
	owner: GameParticipantSchema,
	description: String,
	actions: [GameActionSchema]
};

function BaseGameSchema() {
	Schema.apply(this, arguments);
	this.add({
		owner: {type: Schema.Types.ObjectId, ref : 'Player'},
		name: String,
		rules: {type: Schema.Types.ObjectId, ref: 'RuleSet'},
		participants: [GameParticipantSchema],
		currentState: GameStateContainerSchema,
		moves: [GameTurnSchema]
	});
}

util.inherits(BaseGameSchema, Schema);

BaseGameSchema.prototype.setActionType = function(type) {
	this.path('moves').schema.path('actions').schema.add({action: type});
};

BaseGameSchema.prototype.setStateTypes = function(states) {
	
	if (states.global) {
		this.add(states.global, 'currentState.global.');
	}
	
	if (states.perParticipant) {
		this.path('currentState.perParticipant').schema.add(states.perParticipant, 'state.');
	}
};

module.exports = BaseGameSchema;
