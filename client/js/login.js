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

		.controller('pcLoginCtrl', function($scope, $http, $window, $location) {
			$scope.errorMessages = {};
			if ($location.hash === '/login?timeout') {
				$scope.errorMessages.login = "Your playchaser session timed out. Please log in again.";
			}
			$scope.doLogin = function(login) {
				$scope.errorMessages.login = "";
				$http.post('login', login).success(function(result) {
					$window.location.href = result.href;
				}).error(function() {
					$scope.errorMessages.login = "Invalid username or password. Please try again.";
				});
			};
		});
		
})(angular);
