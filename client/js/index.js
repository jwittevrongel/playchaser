(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser.environment', 'playchaser', 'ngResource'])
		.run(function ($rootScope, $resource, pcEnvironment) {
			$rootScope.player = $resource(pcEnvironment.site.restRoot + 'players/me').get();
		})
		.controller('pcMainCtrl', function($scope, pcGame) {
			$scope.games = {
				mine: pcGame.query(),
				open: pcGame.query({ needsPlayers:1 })
			};
		});
})(angular);