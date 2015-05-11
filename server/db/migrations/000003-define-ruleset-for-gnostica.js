"use strict";

var ruleset = require('../../domain/gameroom/ruleset'),
    rulesetRepository = require('../repository/ruleset'),
	RULESET_ID = 'gnostica';

exports.schema = rulesetRepository.schemaName;

exports.up = function(db) {
	var gnostica = ruleset.createRuleset(RULESET_ID, 'Gnostica');
	gnostica.description = 'A muti-player strategy game where players compete for influence over a magical landscape of tarot cards.';
	gnostica.participants = {
		min: 2,
		max: 6
	};
	var repo = rulesetRepository.open(db);
	return repo.save(gnostica);
};

exports.down = function(db) {
	var repo = rulesetRepository.open(db);
	return repo.removeById(RULESET_ID);
};
