(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcWebsocket', ["$window",
			function($window) {
				return $window.WebSocket;
			}
		]);
})(angular);