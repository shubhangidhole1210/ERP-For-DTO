erpApp.controller('productionPlanCtrl', function($scope, $http, $mdDialog,utils,
		 $rootScope, SERVER_URL, Auth) {

	$scope.currentDate = new Date();
	console.log('todays date' + $scope.currentDate)
	$scope.monthStart = new Date($scope.currentDate.getFullYear(),
			$scope.currentDate.getMonth(), 1);
	console.log('monthStart' + $scope.monthStart)
	$scope.alldays = [];
	while ($scope.monthStart.getMonth() === $scope.currentDate.getMonth()) {
		$scope.alldays.push(new Date($scope.monthStart));
		$scope.monthStart.setDate($scope.monthStart.getDate() + 1);
	}
	console.log('all days are' + $scope.alldays);

	$scope.getProductionPlanList = function() {
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanForCurrentMonth";
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};

		$http(httpparams).then(function successCallback(response) {
			utils.hideProgressBar();
			$scope.products = response.data;
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		});

	};
	
	$scope.submitProductionPlan = function(){
		console.log($scope.products);
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'PUT';
		httpparams.data = $scope.products;
		httpparams.url = SERVER_URL + "productionplanning/updateProductionPlan";
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};

		$http(httpparams).then(function successCallback(response) {
			utils.hideProgressBar();
//			$scope.products = response.data;
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		});
	};

});