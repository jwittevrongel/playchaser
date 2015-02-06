(function(angular){
	"use strict";

	angular.module("playchaser.index")
		.config(function($routeProvider) {
			$routeProvider.otherwise({
				templateUrl: 'js/home.html',
				controller: 'pcHomeCtrl'
			});
		});
})(angular);