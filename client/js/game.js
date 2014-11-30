(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcGame', function($resource, pcEnvironment) {
			var GameResource = $resource(
				pcEnvironment.site.restRoot + "games/:name/:id",
				{ name: "@name", id: "@id" }
			);
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