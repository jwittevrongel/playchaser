(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser'])
		.controller('pcMainCtrl', function($scope, $log, pcWebSocket, pcEnvironment) {
			var socket = pcWebSocket(pcEnvironment.wsRoot + 'games/12345', {
				linkedScope: $scope
			});
			socket.on('open', function() {
				$log.info('yes');
			});
		});
})(angular);