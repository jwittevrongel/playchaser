(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcCurrentPlayer', function ($resource, pcEnvironment) {
			var _currentPlayer;
			if (!_currentPlayer) {
				_currentPlayer = $resource(pcEnvironment.site.restRoot + 'players/me').get();
			}
			return _currentPlayer;
		});
})(angular);