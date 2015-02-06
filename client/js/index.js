(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser.environment', 'playchaser', 'ngResource', 'ngRoute'])
		.controller('pcMainCtrl', function($scope, pcCurrentPlayer) {
			$scope.player = pcCurrentPlayer;
		});
})(angular);