"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
 
var PlayerSchema = new Schema({
    passwd: { type: String },
    idp: { type: String, required: true },
    _id : { type: String },
    profile: {
    	realName: String,
        email: String,
        avatarUrl: String,
        location: {
            city: String,
            state: String,
            country: String
        },
        locale: {
            tz: String,
            lang: String
        },
    }
});

PlayerSchema.index({ _id: 1, idp: 1 }); 

PlayerSchema.pre('save', function(next) {
    var player = this;
 
	// only hash the password if it has been modified (or is new)
	if (!player.isModified('passwd')) {
		return next();
 	}
 	
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    	if (err) { 
    		return next(err);
    	}
 
    	// hash the password using our new salt
    	bcrypt.hash(player.passwd, salt, function(err, hash) {
        	if (err) {
        		return next(err);
 			}
 			
        	// override the cleartext password with the hashed one
        	player.passwd = hash;
        	next();
    	});
	});
});
 
PlayerSchema.methods.checkPassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.passwd, function(err, isMatch) {
        if (err) {
        	return callback(err);
        }
        callback(null, isMatch);
    });
};
 
exports = mongoose.model("Player", PlayerSchema);