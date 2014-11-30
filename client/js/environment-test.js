(function(angular){
	"use strict";
	angular.module('playchaser.environment', [])
		.constant('pcEnvironment', {
			site: {
				restRoot: "http://localhost:3000/",
				wsRoot: "ws://localhost:3000/"
			}
		});
})(angular);