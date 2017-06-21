erpApp.controller('reportCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
     $scope.isPagePresent=false;
     $scope.setreports = function(){
		$scope.reports = Auth.getReport();
	}
	
	$scope.fetchReportData = function(){
		$scope.rmMsg = false;
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "report/inputParameters/"+$scope.selectedReport;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");
		})
	}
});
