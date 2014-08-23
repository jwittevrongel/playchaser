(function(angular) {
	"use strict";
	angular.module('playchaser.index', ['playchaser'])
		.controller('mainPageCtrl', ['$scope', '$log', 'pcWebsocket', 'pcEnvironment',
			function($scope, $log, PCWebsocket, pcEnvironment) {
				var socket = new PCWebsocket(pcEnvironment.wsRoot + 'games/12345', {
					linkedScope: $scope
				});
				socket.on('open', function() {
					$log.info('yes');
				});
			}]);
})(angular);