(function(angular){
	"use strict";
	angular.module('playchaser')
		.constant('pcEnvironment', {
			restRoot: "http://localhost:3000/",
			wsRoot: "ws://localhost:3000/"
		});
})(angular);