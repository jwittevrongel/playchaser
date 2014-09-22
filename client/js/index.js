(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser', 'ngResource'])
		.run(function ($rootScope, $resource, pcEnvironment) {
			$rootScope.player = $resource(pcEnvironment.site.restRoot + 'players/me').get();
		})
		.controller('pcMainCtrl', function($scope, $log, pcWebSocket, pcEnvironment) {
			var socket = pcWebSocket(pcEnvironment.site.wsRoot + 'games/12345', {
				linkedScope: $scope
			});
			socket.on('open', function() {
				$log.info('yes');
			});
		});
})(angular);