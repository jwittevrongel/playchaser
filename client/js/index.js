(function(angular) {
	"use strict";
	angular.module('playchaser', [])
		.run(['$log', 
			function($log) {
				var socket = new WebSocket("ws://localhost:3000/games/12345");
				socket.onopen = function() {
					$log.info('yes');
				};
			}]);
})(angular);