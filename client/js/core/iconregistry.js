(function(angular){
	angular.module('playchaser')
		.config(function($mdIconProvider) {
			$mdIconProvider
				.icon('playchaser', 'img/appicon.svg')
			    .icon('meeple', 'img/meeple.svg');
		});
})(angular);