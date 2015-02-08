"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    util = require('util');

require('./RuleSet');

var GameParticipantSchema = {
	name: String,
	player: {type: Schema.Types.ObjectId, ref : 'Player'}
};

var GameStateSchema = {
};

var GameStateContainerSchema = {
	currentTurn: GameParticipantSchema,
	stanza: {type: String, enum: ['pre-game', 'game-on', 'game-over'], default: 'pre-game'},
	needsPlayers: Boolean,
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
	
	this.pre('save', function(next) {
		var game = this;
		if (game.currentState.stanza === 'pre-game') {
			game.populate('rules', function(err) {
				if (err) {
					return next(err);
				}
				game.currentState.needsPlayers = (game.participants.length < game.rules.participants.max);
				next();
			});			
		} else {
			game.currentState.needsPlayers = false;
			next();
		}
	});
	
	this.methods.presentTo = function(user) {
		return this.toObject({
			getters: true,
			transform: function(doc, ret) {
				if (ret._id) {
					if (ret._id.toHexString) {
						ret.id = ret._id.toHexString();
					}
					else {
						ret.id = ret._id;
					}
					delete ret._id;
				}
				if ('function' == typeof doc.ownerDocument || !ret.currentState) {
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
				return ret;
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
