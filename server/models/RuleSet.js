"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var RuleSetSchema = new Schema({
	_id: {type: String},
	name: {type: String, required: true},
	description: { type: String, required: true},
	variants: [RuleSetSchema],
	participants: {
		min: { type: Number},
		max: { type: Number}
	}
});

module.exports = mongoose.model("RuleSet", RuleSetSchema);