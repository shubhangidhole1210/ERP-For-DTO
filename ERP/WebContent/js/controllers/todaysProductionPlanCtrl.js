erpApp.controller('todaysPlanCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,$location)
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
			httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListByDate/"+ $scope.currentDate;
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};

			$http(httpparams).then(function successCallback(response) {
				utils.hideProgressBar();
				$scope.productList = response.data;
				/* $scope.displayNone();*/
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
	  }
	  
	  
	  
	  
	  /*$scope.isNone=false;
	  $scope.displayNone=function()
	  {
		  if($scope.products.length==0)
			{
			$scope.isNone=true; 
			}
		else
			{
			$scope.isNone=false; 
			}
	  }*/
	  
	 /* $scope.getTidaysProductionPlan=function(index)
	  {
		  utils.showProgressBar();
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productionplanning/getProductionPlanByDateAndPId/" + $scope.currentDate + '/' + $scope.products.product.id;
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
	  }*/
	  
	 /* $scope.submitTodayProductionPlan=function(){
		  if ($scope.todaysProductionPlanInformation.$valid) {
			  $scope.updateProductionPlan();
		  }
	  };*/
	  
	 /* $scope.updateProductionPlan=function()
	  {
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
	  }*/
	  
	  
	  $scope.saveTodaysProductionPlan=function()
	  {
		  
		  var index=0;
			var productinPlanCurrentDateLists = [];
			for(index=0;index<$scope.productList.length;index++){
				var product = {};
				product.productId= $scope.productList[index].product.id;
				product.targetQuantity = $scope.productList[index].targetQuantity;
				product.achivedQuantity = $scope.productList[index].achived;
				product.remark = $scope.productList[index].remark;
				product.productionPlanId = $scope.productList[index].id;
				productinPlanCurrentDateLists.push(product);
			}
			
			var data = {
					createDate:$scope.currentDate,
					productinPlanCurrentDateLists:productinPlanCurrentDateLists
					
				};
				var httpparams = {
						method : 'post',
						url : SERVER_URL + "dailyproduction/dailyproductionSave",
						data : data
					};
				
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
				$http(httpparams).then(function successCallback(data) {
					
					console.log(data.data.message);
					console.log(data);
					
					if(data.data.code === 1){
						utils.showToast("Todays production Plan Update sucessfully!");
						$location.path('/');
					}else{
						utils.showToast("Something went wrong. Please try again later.");
					}
					utils.hideProgressBar();
					
				}, function errorCallback(response) {
					console.log("Error");
					utils.showToast("Something went wrong. Please try again later.");
					utils.hideProgressBar();
				});

				utils.showProgressBar();
	  }
	  
});