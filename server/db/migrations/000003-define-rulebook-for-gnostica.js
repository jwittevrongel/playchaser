"use strict";

var rulebook = require('../../domain/gameroom/rulebook'),
    rulebookRepository = require('../repository/rulebook'),
	RULEBOOK_ID = 'gnostica';

exports.schema = rulebookRepository.schemaName;

exports.up = function(db) {
	var gnostica = rulebook.createRulebook(RULEBOOK_ID, 'Gnostica');
	gnostica.description = 'A muti-player strategy game where players compete for influence over a magical landscape of tarot cards.';
	gnostica.participants = {
		min: 2,
		max: 6
	};
	var repo = rulebookRepository.open(db);
	return repo.save(gnostica);
};

exports.down = function(db) {
	var repo = rulebookRepository.open(db);
	return repo.removeById(RULEBOOK_ID);
};
