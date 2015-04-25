"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var RuleSetSchema = new Schema({
	_id: {type: String},
	name: {type: String, required: true},
	description: { type: String, required: true},
	participants: {
		min: { type: Number},
		max: { type: Number}
	}
});

RuleSetSchema.add({
	variants: [RuleSetSchema]
});

module.exports = mongoose.model("RuleSet", RuleSetSchema);