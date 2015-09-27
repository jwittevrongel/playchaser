"use strict";

var HttpStatus = require('http-status-codes'),
    Promise = require('bluebird'),
	ResourceResult = require('./result');

function statusResult(promise, status, additionalProperties) {
	return promise.then(function(result) {
		if (result) {
			return new ResourceResult(status, result, additionalProperties);
		}
		return new ResourceResult(HttpStatus.NOT_FOUND, {});
	});
}

exports.ok = function(resourcePromise) {
	return statusResult(resourcePromise, HttpStatus.OK);
};

exports.created = function(resourcePromise, uri) {
	return statusResult(resourcePromise, HttpStatus.CREATED, { uri: uri });
};

exports.badRequest = function() {
	return Promise.resolve(new ResourceResult(HttpStatus.BAD_REQUEST, {}));
};

