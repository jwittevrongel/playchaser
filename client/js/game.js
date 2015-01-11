(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcGame', function($resource, $http, $filter, pcEnvironment, pcCurrentPlayer) {
			var GameResource = $resource(
				pcEnvironment.site.restRoot + 'games/:ruleset/:id',
				{ ruleset: '@rules.id', id: '@id' }				
			);

			GameResource.prototype.join = function() {
				var self = this;
				return $http.post(pcEnvironment.site.restRoot + 'games/' + this.rules.id + '/' + this.id + '/participants')
					.success(function(data) {
						angular.extend(self, data);
					});
			};

			GameResource.prototype.makeMove = function(/*move*/) {
				// make a move in the game
			};

			Object.defineProperty(GameResource.prototype, 'canBeJoined', {
				get: function() { 
					return (this.currentState.stanza === 'pre-game' && $filter('filter')(this.participants, { player: { _id: pcCurrentPlayer._id }}).length === 0);
				},

			});

			return GameResource; 
		})
		.directive('pcGameList', function() {
			return {
				templateUrl: 'js/gameList.html',
				scope: {
					gameList: '=pcGameList',
					player: '=pcPlayer'
				}
			};
		});
})(angular);