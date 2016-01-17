(function(angular) {
    'use strict';
    angular.module('playchaser.index', [
        'playchaser.environment',
        'playchaser.session',
        'playchaser',
        'ngResource',
        'ngRoute',
        'ngMaterial'
    ])
    .controller('pcMainCtrl', function($scope, pcPlayer, pcGameRoom) {
        $scope.player = pcPlayer.current();
        $scope.allRuleBooks = pcGameRoom.ruleBooks.query();
        $scope.createGame = function(rulebookId) {
            pcGameRoom.tables.save({rulebook: {_id: rulebookId}});
        };
    });
})(angular);
