"use strict";

var Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt')),
	SALT_WORK_FACTOR = 10;

function Identity(idp) {
	this.idp = idp;
	this.idpUsername = null;
}

function setPassword(identity, newPassword) {
	// generate a salt
    return bcrypt.genSaltAsync(SALT_WORK_FACTOR)
		.then(function(salt) {
			return bcrypt.hashAsync(newPassword, salt);
		})
		.then(function(hash) {
			identity.passwd = hash;
		})
		.then(function() {
			return identity;
		});
}

Identity.prototype.isValid = function() {
	if (!this.idp || !this.idpUsername) {
		return false;
	}
	if (this.isPlaychaser()) {
		if (!this.passwd) {
			return false;
		}
	}
	return true;
};

Identity.prototype.changePassword = function(oldPassword, newPassword) {
	return this.checkPassword(oldPassword)
		.then(function(match) {
			if (!match) {
				return Promise.reject("password does not match");
			}
			return setPassword(this, newPassword);
		});
};

Identity.prototype.isPlaychaser = function() {
	return (this.idp === 'this');
};

Identity.prototype.checkPassword = function(candidatePassword) {
	 return bcrypt.compareAsync(candidatePassword, this.passwd);
};

module.exports.createPlaychaserIdentity = function(emailAddress, password) {
	var identity = new Identity('this');
	identity.idpUsername = emailAddress;
	if (password) {
		return setPassword(identity, password);
	}
	return Promise.resolve(identity);
};

