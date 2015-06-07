(function(angular){
	angular.module('playchaser')
		.config(function($mdIconProvider) {
			$mdIconProvider.fontSet('fa', 'fa');
			$mdIconProvider.icon('playchaser', 'img/appicon.svg');
		});
})(angular);