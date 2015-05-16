"use strict";

function ResourceError(status, detail) {
	this.status = status;
	this.detail = detail;
	if (detail) {
		this.message = detail.message;
	}
    this.name = "ResourceError";
    Error.captureStackTrace(this, ResourceError);
}
ResourceError.prototype = Object.create(Error.prototype);
ResourceError.prototype.constructor = ResourceError;

module.exports = ResourceError;

