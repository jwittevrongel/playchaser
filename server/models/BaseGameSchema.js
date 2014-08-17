"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    util = require('util');

var GameParticipantSchema = {
	name: String,
	player: {type: Schema.Types.ObjectId, ref : 'Player'}
};

var GameStateSchema = {
};

var GameStateContainerSchema = {
	currentTurn: GameParticipantSchema,
	isStarted: {type: Boolean, default: false},
	isCompleted: {type: Boolean, default: false},
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
		owner: {type: Schema.Types.ObjectId, ref: 'Player'},
		name: String,
		rules: {type: String, ref: 'RuleSet'},
		participants: [GameParticipantSchema],
		currentState: GameStateContainerSchema,
		moves: [GameTurnSchema]
	});
	
	this.methods.presentTo = function(user) {
		return this.toObject({
			getters: true,
			transform: function(doc, ret) {
				if ('function' == typeof doc.ownerDocument) {
 					 return ret;
				}
				if(ret.currentState.global && ret.currentState.global.private) {
					delete ret.currentState.global.private;
				}
				if (ret.currentState.perParticipant) {
					ret.currentState.perParticipant.forEach(function(participant) {
						if (participant.state.private && participant.participant.player != user._id) { 
							delete participant.state.private; 
						}
					});
				}
			}	
		});
	};
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