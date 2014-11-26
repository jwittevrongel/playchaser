(function(angular) {
	"use strict";
	angular.module('ng').config(function($compileProvider, $httpProvider) {
		$compileProvider.debugInfoEnabled(false);
		$httpProvider.useApplyAsync(true);
	});
})(angular);