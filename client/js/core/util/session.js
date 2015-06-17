(function(angular) {
	"use strict";
	angular.module('playchaser.session', ['playchaser'])
		.service('redirectToLoginWhenUnauthorized', function($q, pcPlayerSession) {
			return {
				responseError: function(rejection) {
					if (rejection.status === 401) {
						pcPlayerSession.end('timeout');
					}
					return $q.reject(rejection);
				}	
			};
		})
		.config(function($httpProvider){
			$httpProvider.interceptors.push('redirectToLoginWhenUnauthorized');
		});
})(angular);		