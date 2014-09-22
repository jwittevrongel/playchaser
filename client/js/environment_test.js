(function(angular){
	"use strict";
	angular.module('playchaser')
		.constant('pcEnvironment', {
			site: {
				restRoot: "https://localhost:3000/",
				wsRoot: "wss://localhost:3000/"
			}
		});
})(angular);