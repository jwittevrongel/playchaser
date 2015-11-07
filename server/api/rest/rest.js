"use strict";

var	HttpStatus = require('http-status-codes'),
    ResourceError = require('../resources/error');
	
exports.wrapResourceJson = function(res, resourcePromise) {
	return resourcePromise
		.then(function(result) {
			if (result.uri) {
				res.location(result.uri);
			}
			return res.status(result.status).json(result.value);
		})
		.catch(ResourceError, function(resErr) {
			return res.status(resErr.status).json(resErr.detail); 
		})
		.catch(function(e) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e); 
		});
};
