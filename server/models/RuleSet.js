"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var RuleSetSchema = new Schema({
	name: {type: String, required: true},
	displayName: {type: String, required: true},
	description: { type: String, required: true},
	variants: [RuleSetSchema] 
});

RuleSetSchema.statics.findIdForName = function(name, callback) {
	RuleSetSchema.findOne({name: name}, "_id", function(err, ruleSet) {
		if (err) {
			callback(err);
		} else {
			callback(err, ruleSet._id);
		}	
	});
};

module.exports = mongoose.model("RuleSet", RuleSetSchema);