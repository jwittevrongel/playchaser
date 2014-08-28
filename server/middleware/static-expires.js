"use strict";

var cacheControlHeader = 'Cache-Control';
var maxAge = 3600 * 24 * 365 - 10; // a year less 10 seconds
var cacheForALongTime = 'public, max-age=' + maxAge;

function setHeadersToCacheForALongTime(res) {
    res.setHeader(cacheControlHeader, cacheForALongTime);
}

module.exports = function(req, res, next) {
	// set far-future expires for paths that are immutable
	if (req.url.lastIndexOf('/lib/', 0) === 0) {
    	setHeadersToCacheForALongTime(res);
    }
    if (req.url.lastIndexOf('/font/', 0) === 0) {
        setHeadersToCacheForALongTime(res);
    }
    
    next(); 
};