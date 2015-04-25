"use strict";

var RuleSet = require('../../models/RuleSet');

exports.up = function(mongoose, next) {
	var gnosticaRuleSet = new RuleSet({
		_id: 'gnostica',
		name: 'Gnostica',
		description: 'A muti-player strategy game where players compete for influence over a magical landscape of tarot cards.',
		variants:[],
		participants: {
			min: 2,
			max: 6
		}
	});
	
	gnosticaRuleSet.save(function(err) {
		next(err);
	});
};

exports.down = function(mongoose, next) {
	RuleSet.remove({_id: 'gnostica'}, function(err) {
		next(err);
	});
};
