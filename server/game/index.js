"use strict";

var fs = require('fs'),
	path = require('path'),
	Game = require('../models/Game');

var ruleSets = {};
fs.readdirSync(__dirname + '/rules/').forEach(function(file) {
	if (path.extname(file) == '.js') {
		var ruleSetName = path.basename(file, '.js');
		ruleSets[ruleSetName] = require('./rules/' + ruleSetName);
	}
});

function presentGames(games, user) {
	var result = [];
	if (games && games.length) {
		games.forEach(function(game) {
			var presented = game.presentTo(user);
			presented.url = '/games/' + game.rules + '/' + game.id;
			result.push(presented);
		});
	}
	return result;
}

function getListOfGames(model, req, res) {
	var theQuery = model.find();

	if (req.query.hasOwnProperty('needsPlayers')) {
		theQuery = theQuery.where('currentState.needsPlayers').equals(true)
						   .where('participants.player').ne(req.user._id);
	} else {
		// unless looking for a game to join, limit to games the player is already in
		theQuery = theQuery.where('participants.player').equals(req.user._id);
	}

	// query parameters can narrow this list further
	if (req.query.hasOwnProperty('myTurn')) {
		theQuery = theQuery.where('currentState.currentTurn.player').equals(req.user._id);
	}

	if (req.query.hasOwnProperty('stanza')) {
		theQuery = theQuery.where('currentState.stanza').equals(req.query.stanza);
	} 
	theQuery.select('owner name rules participants currentState.currentTurn currentState.stanza')
		.populate('rules')
		.populate('participants.player', 'username')
		.exec(function(err, games) {
			res.json(presentGames(games, req.user));
		});
}

exports.configureRoutes = function(app) {
	app.param('game_id', function(req, res, next, game_id){
		Game.findById(game_id, function(err, game){
			if (err) {
		  		next(err);
			} else if (game) {
				// ruleset match?
				if (game.rules != req.params.ruleset) {
					return res.status(404).send("Game " + req.params.game_id + " was not found.");
				}
		  		req.game = game;
		  		next();
			} else {
		  		res.status(404).send("Game " + game_id + " was not found.");
			}
	  	});
	});
	
	app.route('/games').get(function(req, res) {
		getListOfGames(Game, req, res);
	});
		
	app.route('/games/:ruleset/:game_id').get(function(req, res) {
		// are they a participant?
		var isParticipant = false;
		req.game.participants.forEach(function(participant) {
			if (participant.player == req.user._id) {
				isParticipant = true;
			}
		});
		
		if (isParticipant) {
			res.json(req.game.presentTo(req.user));
		}
		else {
			res.status(403).send("You are not a participant in this game");
		} 
	});
	
	app.route('/games/:ruleset/')
		.get(function(req, res) {
			getListOfGames(ruleSets[req.params.ruleset].model, req, res);
		})
		.post(function(req, res) {
			ruleSets[req.params.ruleset].create(req, res);
		});

	app.route('/games/:ruleset/:game_id/participants').post(function (req, res) {
		if (req.game.currentState.needsPlayers) {
			if (!req.game.participants.some(function(participant) {
				return (participant.player == req.user._id);
			})) {
				req.game.participants.push({name: '', player: req.user._id});
				req.game.save(function(err){
					if (err) {
						return res.status(500).send('Error joining game: ' + req.game._id);
					}
					res.json(req.game.presentTo(req.user));
				});
				return;
			}
		} 
		return res.status(400).send('Cannot join game: ' + req.game._id);
	});
};