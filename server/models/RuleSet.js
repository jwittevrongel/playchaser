"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var RuleSetSchema = new Schema({
	name: {type: String, required: true},
	displayName: {type: String, required: true},
	description: { type: String, required: true},
	variants: [RuleSetSchema] 
});

module.exports = mongoose.model("RuleSet", RuleSetSchema);