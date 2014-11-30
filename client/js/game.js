(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcGame', function($resource, pcEnvironment) {
			var GameResource = $resource(
				pcEnvironment.site.restRoot + "games/:name/:id",
				{ name: "@name", id: "@id" }
				// TODO: Custom actions?
			);

			GameResource.prototype.joinGame = function() {
				// adds the current player to the game
			};

			GameResource.prototype.makeMove = function(/*move*/) {
				// make a move in the game
			};

			return GameResource; 
		})
		.directive('pcGameList', function() {
			return {
				templateUrl: 'js/gameList.html',
				scope: {
					gameList: '=pcGameList'
				}
			};
		});
})(angular);