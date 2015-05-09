"use strict";

exports.schema = 'gameLibrary';

exports.up = function(db) {
	return db.collection('rulesets').updateOneAsync({ _id: 'gnostica' }, {
		name: 'Gnostica',
		description: 'A muti-player strategy game where players compete for influence over a magical landscape of tarot cards.',
		variants:[],
		participants: {
			min: 2,
			max: 6
		}
	}, { upsert: true });
};

exports.down = function(db) {
	return db.collection('rulesets').deleteOneAsync({_id: 'gnostica'});
};