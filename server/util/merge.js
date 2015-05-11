"use strict";

function getType(obj) {
	return ({}).toString.call(obj).slice(8, -1).toLowerCase();
}

function mergeTwo(target, source) {
	if (getType(target) === 'object') {
		for (var key in source) {
			if (getType(target[key]) === 'object' && getType(source[key]) === 'object') {
				target[key] = mergeTwo(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
}

function merge() {
	var args = arguments;
	var count = args.length;
	if (count === 0) {
		return null;
	}
	var target = args[0];
	for (var i = 1; i < count; ++i) {
		target = mergeTwo(target, args[i]);
	}
	return target;
}

module.exports = merge;
