(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser.environment', 'playchaser.session', 'playchaser', 'ngResource', 'ngRoute'])
		.controller('pcMainCtrl', function($scope, pcCurrentPlayer) {
			$scope.player = pcCurrentPlayer;
		});
})(angular); 