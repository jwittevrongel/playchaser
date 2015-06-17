(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser.environment', 'playchaser.session', 'playchaser', 'ngResource', 'ngRoute', 'ngMaterial'])
		.controller('pcMainCtrl', function($scope, pcPlayer) {
			$scope.player = pcPlayer.current();
		});
})(angular); 