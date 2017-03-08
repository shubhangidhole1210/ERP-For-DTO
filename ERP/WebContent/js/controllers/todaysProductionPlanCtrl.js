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

			$http(httpparams).then(function successCallback(data) {
				utils.hideProgressBar();
				console.log(data.data.message);
				if(data.data.code === 1){
					utils.showToast("Todays production plan update sucessfully !");
				}else{
					utils.showToast("Something went wrong. Please try again later.");
				}
				
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
	  }
	  
});