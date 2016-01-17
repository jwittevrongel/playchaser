(function(angular) {
    'use strict';
    angular.module('playchaser.login', [
        'playchaser.environment',
        'playchaser',
        'ngMaterial',
        'ngMessages'
    ])
    .directive('pcMustEqual', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, $element, $attrs, ngModelCtrl) {
                $scope.$watch($attrs.pcMustEqual, function(newValue) {
                    if (
                        angular.isDefined(ngModelCtrl.$viewValue) &&
                        ngModelCtrl.$viewValue.length
                    ) {
                        ngModelCtrl.$setValidity('pcMustEqual',
                            newValue === ngModelCtrl.$viewValue);
                    }
                });

                ngModelCtrl.$validators.pcMustEqual = function(newValue) {
                    if (!(angular.isDefined(newValue) && newValue.length)) {
                        return true;
                    }
                    return (newValue === $scope.$eval($attrs.pcMustEqual));
                };
            }
        };
    })
    .directive('pcCheckUserAvailable', function($http, $q, pcEnvironment) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, $element, $attrs, ngModelCtrl) {
                ngModelCtrl.$asyncValidators.pcCheckUserAvailable = function(val) {
                    var deferred = $q.defer();
                    var config = {
                        params: {
                            exists: 1
                        }
                    };
                    config.params[$attrs.pcCheckUserAvailable] = val;
                    $http.get(pcEnvironment.site.restRoot + 'players', config).success(function() {
                        deferred.reject(false);
                    })
                    .error(function(data, status) {
                        if (status === 404) { // 404 means the moniker or email doesn't exist
                            deferred.resolve(true);
                        }
                        else {
                            deferred.reject(false);
                        }
                    });

                    return deferred.promise;
                };
            }
        };
    })
    .controller('pcLoginCtrl', function($scope, $http, $window, $location, pcEnvironment) {
        $scope.errors = {
            page: {},
            login: {},
            signup: {}
        };

        if ($location.path() === '/timeout') {
            $scope.errors.page.sessionTimeout = true;
        }

        $scope.doLogin = function(login) {
            $scope.errors.page = {};
            $scope.errors.login = {};
            $http.post(pcEnvironment.site.restRoot + 'login', login).success(function(data) {
                $window.location.href = data.href;
            }).error(function(data, status) {
                if (status === 401) {
                    $scope.errors.login.invalidLogin = true;
                }
                $scope.errors.login.serverFailure = true;
            });
        };

        $scope.doSignup = function (signup) {
            $scope.errors.page = {};
            $scope.errors.signup = {};
            $http.post(pcEnvironment.site.restRoot + 'players', signup).success(function(data) {
                $window.location.href = data.href;
            }).error(function(data) {
                if (data.err) {
                    $scope.errors.signup[data.err] = true;
                } else {
                    $scope.errors.signup.serverFailure = true;
                }
            });
        };
    });
})(angular);
