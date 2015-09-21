"use strict";

var HttpStatus = require('http-status-codes');

function statusResult(promise, status) {
	return promise.then(function(result) {
		if (result) {
			return { status: status, value: result };
		}
		return { status: HttpStatus.NOT_FOUND, value: {} };
	});
}

exports.ok = function(resourcePromise) {
	return statusResult(resourcePromise, HttpStatus.OK);
};

exports.created = function(resourcePromise) {
	return statusResult(resourcePromise, HttpStatus.CREATED);
};