(function(){
	"use strict";
	angular.module("playchaser.index")
		.controller("pcHomeCtrl", function($scope, pcGame) {
			$scope.games = {
				mine: pcGame.query(),
				open: pcGame.query({ needsPlayers:1 })
			};
		});
})(angular);
