erpApp.controller('productionPlanCtrl', function($scope, $http, $mdDialog,utils,
		 $rootScope, SERVER_URL, Auth) {

	$scope.currentDate = new Date();
	$scope.monthStart = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), 1);
	$scope.alldays = [];
	while ($scope.monthStart.getMonth() === $scope.currentDate.getMonth()) {
		$scope.alldays.push(new Date($scope.monthStart));
		$scope.monthStart.setDate($scope.monthStart.getDate() + 1);
	}
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
			$scope.products_copy = angular.copy(response.data);
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		});

	};
	function isProductionPlanEqual(productProductionPlan1, productProductionPlan2){
		if(productProductionPlan1.target_quantity === productProductionPlan2.target_quantity && 
				productProductionPlan1.achived_quantity === productProductionPlan2.achived_quantity && 
				productProductionPlan1.dispatch_quantity === productProductionPlan2.dispatch_quantity){
			return true;
		}else{
			return false;
		}
	}
	$scope.submitProductionPlan = function(){
		console.log($scope.products);
		for(var index =0; index < $scope.products.length; index++){
			var productProductionPlan = [];
			for(var index2 =0; index2 < $scope.products[index].productProductionPlan.length;index2++){
				
				if(!isProductionPlanEqual($scope.products[index].productProductionPlan[index2], $scope.products_copy[index].productProductionPlan[index2])){
					productProductionPlan.push($scope.products[index].productProductionPlan[index2]);
				}
			}
			$scope.products_copy[index].productProductionPlan = productProductionPlan;
		}
		console.log('modified', $scope.products_copy[index]);
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'PUT';
		httpparams.data = $scope.products_copy;
		httpparams.url = SERVER_URL + "productionplanning/updateProductionPlan";
		httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};

		$http(httpparams).then(function successCallback(response) {
			utils.hideProgressBar();
			console.log(response);
			if(data.code === 1){
				utils.showToast("Production Plan sucessfully!");
				$location.path('/');
			}else{
				utils.showToast("Something went wrong. Please try again later.");
			}
		}, function errorCallback(response) {
			console.log("Error");
			utils.showToast("Something went wrong. Please try again later.");
			utils.hideProgressBar();
		});
	};
	
	// TODO Implement Web service call Create Default Production Plan
	// TODO Implement Notification to tell user that new Product is added to the Product List and add it to the Production Plan.
	// TODO Reload Production Plan after any change in Production Plan

});