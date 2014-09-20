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
					
					ngModelCtrl.$validators.pcValidateEqual = function(newValue) {
						if (!(angular.isDefined(newValue) && newValue.length)) {
							return true;
						}
						return (newValue === $scope.$eval($attrs.pcValidateEqual));
					};
				}
			};
		})

		.directive('pcUserAvailable', function($http, $q) {
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function($scope, $element, $attrs, ngModelCtrl) {
					ngModelCtrl.$asyncValidators.userAvailable = function(val) {
						var deferred = $q.defer();
						var config = {
							params: {
								exists: 1
							}
						};
						config.params[$attrs.pcUserAvailable] = val;
						$http.get('players', config).success(function() { 
								deferred.reject(false); 
							})
							.error(function() { 
								deferred.resolve(true); 
							});

						return deferred.promise;
					};
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
				$http.post('login', login).success(function(data) {
					$window.location.href = data.href;
				}).error(function() {
					$scope.errorMessages.login = "Invalid username or password. Please try again.";
				});
			};

			$scope.doSignup = function (signup) {
				$scope.errorMessages.signup = "";
				$http.post('players', signup).success(function(data) {
					$window.location.href = data.href;
				}).error(function(data) {
					if (data.message) {
						$scope.errorMessages.signup = data.message;
					} else {
						$scope.errorMessages.signup = "An unknown error occurred.  Please try again.";
					}
				});
			};
		});
		
})(angular);
