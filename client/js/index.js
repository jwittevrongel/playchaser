(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser.environment', 'playchaser', 'ngResource'])
		.controller('pcMainCtrl', function($scope, pcGame, pcCurrentPlayer) {
			$scope.player = pcCurrentPlayer;
			$scope.games = {
				mine: pcGame.query(),
				open: pcGame.query({ needsPlayers:1 })
			};
		});
})(angular);