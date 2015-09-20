(function(angular) {
	"use strict";
	angular.module('playchaser')
		.service('pcGameRoom', function($resource, $http, $filter, pcEnvironment, pcPlayer) {
			
			var RuleBookResource = $resource(
				pcEnvironment.site.restRoot + 'rulebooks/:ruleset',
				{ ruleset: '@id' }
			);
			
			var TableResource = $resource(
				pcEnvironment.site.restRoot + 'tables/:ruleset/:id',
				{ ruleset: '@rules.id', id: '@id' }				
			);
	
			TableResource.prototype.join = function() {
				var self = this;
				return $http.post(pcEnvironment.site.restRoot + self.url + '/participants')
					.success(function(data) {
						angular.extend(self, data);
					});
			};

			TableResource.prototype.start = function() {
				var self = this;
				return $http.put(pcEnvironment.site.restRoot + self.url + '/currentState/stanza', angular.toJson("game-on"))
					.success(function(data) {
						angular.extend(self, data);
					});
			};

			Object.defineProperty(TableResource.prototype, 'canBeJoined', {
				get: function() { 
					return (this.currentState.stanza === 'pre-game' && this.currentState.needsPlayers && $filter('filter')(this.participants, { player: { id: pcPlayer.current.id }}).length === 0);
				}
			});

			Object.defineProperty(TableResource.prototype, 'canBeStarted', {
				get: function() {
					return (this.currentState.stanza === 'pre-game' && this.owner === pcPlayer.current.id && !this.currentState.needsPlayers);
				}
			});
			
			return { tables: TableResource, ruleBooks: RuleBookResource };
		})
		.directive('pcTableList', function() {
			return {
				templateUrl: 'js/core/tableList.html',
				scope: {
					gameList: '=pcTableList'
				}
			};
		});
})(angular);