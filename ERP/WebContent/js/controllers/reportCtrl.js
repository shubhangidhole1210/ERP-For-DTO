erpApp.controller('reportCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
     $scope.isPagePresent=false;
     $scope.page={};
     
    
     
	
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
			var input = {};
			input.reportinputparameter = {};
			input.reportinputparameter.displayName = "Employee"
			input.reportinputparameter.inputType = 'select';
			input.reportinputparameter.data = [
			      {
			    	  id : "10",
			    	  description: "Nishant"
			      },
			      {
			    	  id : "11",
			    	  description: "Nikhil"
			      }
			];
			$scope.data.push(input);
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");
		})
	}
});
