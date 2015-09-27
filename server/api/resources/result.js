"use strict";

var _ = require('lodash');

function ResourceResult(status, value, additionalProperties) {
	this.status = status;
	this.value = value;
	_.merge(this, additionalProperties);
}

ResourceResult.prototype.isSuccess = function() {
	return (this.status >= 200 && this.status < 400);
};

module.exports = ResourceResult;
