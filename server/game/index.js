"use strict";

var fs = require('fs'),
	path = require('path'),
	Game = require('../models/Game');


function presentGames(games, user) {
	var result = [];
	if (games && games.length) {
		games.forEach(function(game) {
			result.push(game.presentTo(user));
		});
	}
	return result;
}

exports.configureRoutes = function(app) {
	app.param('game_id', function(req, res, next, game_id){
		Game.findById(game_id, function(err, game){
			if (err) {
		  		next(err);
			} else if (game) {
		  		req.game = game;
		  		next();
			} else {
		  		res.send(404, "Game " + game_id + " was not found.");
			}
	  	});
	});
	
	app.route('games').get(function(req, res) {
		var where = { participants: { player: req.user._id } };
		var filter = "owner name rules participants currentState.currentTurn currentState.isCompleted";
		// query parameters can narrow this list further
		if (req.query.hasOwnProperty('myTurn')) {
			where.currentState = where.currentState || {};
			where.currentState.currentTurn = { player: req.user._id };
		}
		if (req.query.hasOwnProperty('completed')) {
			where.currentState = where.currentState || {};
			where.currentState.isCompleted = true;
		} 
		else if (req.query.hasOwnProperty('active')) {
			where.currentState = where.currentState || {};
			where.currentState.isCompleted = false;
		}
		Game.find(where, filter, function(err, games) {
			res.json(presentGames(games, req.user));
		});
	});
		
	app.route('games/:ruleset/:game_id').get(function(req, res) {
	
		// does the game's ruleset match?
		if (req.game.rules != req.params.ruleset) {
			return res.send(404, "Game " + req.params.game_id + " was not found.");
		}
		
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
			res.send(403, "You are not a participant in this game");
		} 
	});
	
	fs.readdirSync(__dirname + '/rules/').forEach(function(file) {
  		if (path.extname(file) == 'js') {
  			require('./rules/' + path.basename(file, '.js')).configureRoutes(app);
  		}
	});
};