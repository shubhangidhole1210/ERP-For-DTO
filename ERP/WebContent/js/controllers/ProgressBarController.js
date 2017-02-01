erpApp.controller('ProgressBarController',function($scope,$rootScope, $mdDialog) {
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
		
		$rootScope.$on("hide_wait", function (event, args) {
            $mdDialog.cancel();
        }); 
});