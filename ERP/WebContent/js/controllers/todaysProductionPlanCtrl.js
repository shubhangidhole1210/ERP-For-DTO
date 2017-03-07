erpApp.controller('todaysPlanCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils)
{
	
	  
	 $scope.currentDate = new Date();
	 
	  
	  $scope.curr_date = $scope.currentDate.getDate();
	  $scope.curr_month = $scope.currentDate.getMonth() + 1; //Months are zero based
	  $scope.curr_year = $scope.currentDate.getFullYear();
	  $scope.currentDate =  $scope.curr_year + "-" + $scope.curr_month + "-" +  $scope.curr_date;
	  console.log( $scope.currentDate); 
	  
	  
	  $scope.getProducts=function()
	  {
		  utils.showProgressBar();
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productionplanning/getProductionPlanDate/"+ $scope.currentDate;
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
	  }
	  
	  $scope.getTidaysProductionPlan=function(index)
	  {
		  utils.showProgressBar();
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productionplanning/getProductionPlanDateAndPId/" + $scope.currentDate + '/' + $scope.products.product.id;
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};

			$http(httpparams).then(function successCallback(response) {
				utils.hideProgressBar();
				$scope.productsPlan = response.data;
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
	  }
	  
	  $scope.submitTodayProductionPlan=function(){
		  console.log($scope.products);
			utils.showProgressBar();
			var httpparams = {};
			httpparams.method = 'PUT';
			httpparams.data = $scope.productsPlan;
			httpparams.url = SERVER_URL + "productionplanning/update";
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};

			$http(httpparams).then(function successCallback(response) {
				$mdDialog.hide();
				console.log(data);
				if(data.data.code === 0){
					console.log(data.data.message);
					console.log(data);
					$scope.message = 'Something went worng. Please try again later.';
					$scope.showToast();
				}else{
					$scope.displayProgressBar = false;
					$scope.message = 'Status Information saved successfully.';
					$scope.showToast();
					$rootScope.$emit("callPopulateStatusList",{});
				}
				utils.hideProgressBar();
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
	  }
	  
});