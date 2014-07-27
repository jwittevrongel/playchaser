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
				var message = "Game " + game_id + " was not found.";
		  		res.send(404, message);
			}
	  	});
	});
	
	app.route('/games').get(function(req, res) {
		var filter = { participants: { player: req.user._id } };
		
		// query parameters can narrow this list further
		if (req.query.hasOwnProperty('myTurn')) {
			filter.currentState = filter.currentState || {};
			filter.currentState.currentTurn = { player: req.user._id };
		}
		if (req.query.hasOwnProperty('completed')) {
			filter.currentState = filter.currentState || {};
			filter.currentState.isCompleted = true;
		} 
		else if (req.query.hasOwnProperty('active')) {
			filter.currentState.isCompleted = false;
		}
		Game.find(filter, function(err, games) {
			res.json(presentGames(games, req.user));
		});
	});
		
	app.route('/games/:game_id').get(function(req, res) {
		// can they see this game?
		var canSee = false;
		req.game.participants.forEach(function(participant) {
			if (participant.player == req.user._id) {
				canSee = true;
			}
		});
		
		if (canSee) {
			res.json(req.game.presentTo(req.user));
		}
		else {
			res.send(403, "You are not a participant of this game");
		} 
	});
	
	fs.readdirSync(__dirname + '/rules/').forEach(function(file) {
  		if (path.extname(file) == 'js') {
  			require('./rules/' + path.basename(file, '.js')).configureRoutes(app);
  		}
	});
};