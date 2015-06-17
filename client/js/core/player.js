(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcPlayerSession', function($window) {
			return { 
				end: function signOut(reason) {
					var location = '/login.html';
					if (reason) {
						location += '#/' + reason;
					}
					$window.document.cookie = 'pc.sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
					$window.location = location;
				}
			};
		})
		.service('pcPlayer', function($resource, pcEnvironment, pcPlayerSession) {
			var playerResource = $resource(pcEnvironment.site.restRoot + 'players/me');
			var _currentPlayer;
			
			playerResource.prototype.signOut = pcPlayerSession.end;
			
			return {
				signOut: pcPlayerSession.end,
				current: function() {
					if (!_currentPlayer) {
						_currentPlayer = playerResource.get();
					}
					return _currentPlayer;
				}
			};
		});
})(angular);