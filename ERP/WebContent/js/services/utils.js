erpApp.service('utils',function myutils($mdDialog, $rootScope,$mdToast) {

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
		
		function showToast(message) {
			$mdToast.show({
				hideDelay : 3000,
				position : 'top right',
				controller : 'ToastCtrl',
				templateUrl : 'views/toast.html',
				locals : {
					message : message
				}
			});
		};
		return {
			hideProgressBar : hideProgressBar,
			showProgressBar : showProgressBar,
			showToast : showToast
		};
});