"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require(bcrypt),
    SALT_WORK_FACTOR = 10;
 
var PlayerSchema = new Schema({
    _id: { type: String },
    thisPasswd: { type: String },
    idp: { type: String },
    profile: {
    	realName: String,
    	avatarUrl: String,
    	location: {
    		city: String,
    		state: String,
    		country: String
    	},
    	locale: {
    		tz: String,
    		lang: String
    	}
    }
});

PlayerSchema.pre(save, function(next) {
    var player = this;
 
	// only hash the password if it has been modified (or is new)
	if (!player.isModified('thisPasswd')) {
		return next();
 	}
 	
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    	if (err) { 
    		return next(err);
    	}
 
    	// hash the password using our new salt
    	bcrypt.hash(player.thisPasswd, salt, function(err, hash) {
        	if (err) {
        		return next(err);
 			}
 			
        	// override the cleartext password with the hashed one
        	player.thisPasswd = hash;
        	next();
    	});
	});
});
 
PlayerSchema.methods.checkPassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.thisPasswd, function(err, isMatch) {
        if (err) {
        	return callback(err);
        }
        callback(null, isMatch);
    });
};
 
module.exports = mongoose.model("Player", PlayerSchema);