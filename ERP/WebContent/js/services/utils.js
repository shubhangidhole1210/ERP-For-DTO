erpApp.service('utils',function myutils($mdDialog, $rootScope) {

		function hideProgressBar() {
				$rootScope.$emit("hide_wait");
		};

		function showProgressBar() {
			$mdDialog.show({
				controller : 'ProgressBarController',
				templateUrl : 'views/progressBar.html',
				parent : angular.element(document.body),
				clickOutsideToClose : false,
				fullscreen : false
			}).then(function() { });
		};
		return {
			hideProgressBar : hideProgressBar,
			showProgressBar : showProgressBar
		};
});