"use strict";

var farFutureDate = 'Sat, 31 Dec 2050 00:00:00 GMT';
var expiresHeader = 'Expires';
var cacheControlHeader = 'Cache-Control';
var maxAge = 3600 * 24 * 365 * 30; // thirty years
var cacheForThirtyYears = 'public, max-age=' + maxAge;

function setHeadersToCacheForever(res) {
    res.setHeader(expiresHeader, farFutureDate);
    res.setHeader(cacheControlHeader, cacheForThirtyYears);
}

module.exports = function(req, res, next) {
	// set far-future expires for paths that are immutable
	if (req.url.lastIndexOf('/lib/', 0) === 0) {
    	setHeadersToCacheForever(res);
    }
    if (req.url.lastIndexOf('/font/', 0) === 0) {
        setHeadersToCacheForever(res);
    }
    
    next(); 
};