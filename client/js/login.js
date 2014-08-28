(function(angular) {
	"use strict";
	angular.module('playchaser.login', [])
		.directive('pcValidateEqual', function() {
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function($scope, $element, $attrs, ngModelCtrl) {
					$scope.$watch($attrs.pcValidateEqual, function(newValue) {
						if (angular.isDefined(ngModelCtrl.$viewValue) && ngModelCtrl.$viewValue.length) {
							ngModelCtrl.$setValidity('pcValidateEqual', newValue === ngModelCtrl.$viewValue);
						}
					});
					
					ngModelCtrl.$parsers.push(function(newValue) {
						if (!(angular.isDefined(newValue) && newValue.length)) {
							ngModelCtrl.setValidity('pcValidateEqual', true);
							return newValue;
						}
						var isValid = (newValue === $scope.$eval($attrs.pcValidateEqual));
						ngModelCtrl.$setValidity('pcValidateEqual', isValid);
						return isValid ? newValue : undefined;
					});
				}
			};
		})

		.controller('pcLoginCtrl', ['$scope', '$http', '$window',
			function($scope, $http, $window) {
				$scope.doLogin = function(login) {
					$http.post('login', login).success(function(result) {
						$window.location.href = result.href;
					});
				};
			}
		]);
		
})(angular);
