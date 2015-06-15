(function(angular) {
	"use strict";
	angular.module('playchaser.session', [])
		.service('pcSession', function($window) {
			return {
				end: function(reason) {
					var location = '/login.html';
					if (reason) {
						location += '#/' + reason;
					}
					$window.document.cookie = 'pc.sess=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
					$window.location = location;
				}
			};
		})
		.service('redirectToLoginWhenUnauthorized', function($q, pcSession) {
			return {
				responseError: function(rejection) {
					if (rejection.status === 401) {
						pcSession.end('timeout');
					}
					return $q.reject(rejection);
				}	
			};
		})
		.config(function($httpProvider){
			$httpProvider.interceptors.push('redirectToLoginWhenUnauthorized');
		});
})(angular);		