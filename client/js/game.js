(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcGameService', ["$resource", "pcEnvironment",
			function($resource, pcEnvironment) {
				var GameResource = $resource(
					pcEnvironment.restRoot + "games/:name/:id",
					{ name: "@name", id: "@id" }
				);
				return GameResource; 
			}
		]);
})(angular);