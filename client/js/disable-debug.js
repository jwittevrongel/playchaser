(function(angular) {
	"use strict";
	angular.module('ng').config(function($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
	});
})(angular);