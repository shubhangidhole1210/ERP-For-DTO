erpApp.controller('prodcutQualityCheckCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope, SERVER_URL, Auth, utils, $location){
	 $scope.currentDate = new Date();
	 
	  $scope.selectedProductionPlan = {};
	  $scope.QCPassQuantity = 0;
	  $scope.QCFailQuantity = 0;
	  $scope.reamrk = '';
	
	  $scope.currentDate = utils.getCurrentDate();
	  
	  $scope.getProductionPlanByDate=function(){
		  utils.showProgressBar();
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productquality/getQualityPendingListByDate/"+ $scope.currentDate;
			
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};

			$http(httpparams).then(function successCallback(response) {
				utils.hideProgressBar();
				$scope.productionPlans = response.data;
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
	  };
	$scope.comparePassQuantity = function(qualityPendingQuantity, passQuantity, failQuantity){
		if(qualityPendingQuantity >= (passQuantity + failQuantity)){
			$scope.productQualityForm.failQuantity.$setValidity("customMsg", true);
			$scope.errorMsg="";
		}else{
			$scope.productQualityForm.failQuantity.$setValidity("customMsg", false);
			$scope.errorMsg="pending quantity is not equal to pass and fail quantity";
		}
		
	}
	
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveProductQuality();
		} else {
			console.log('its else block');
		}
	};
	
		$scope.saveProductQuality=function()
		{
			 var index=0;
				var productQualityParts = [];
				for(index=0;index<$scope.productionPlans.length;index++){
					var product = {};
					product.productId= $scope.productionPlans[index].product.id;
					product.productQuantity = $scope.productionPlans[index].targetQuantity;
					product.passQuantity = $scope.productionPlans[index].passQuantity;
					product.failQuantity = $scope.productionPlans[index].failQuantity;
					product.remark = $scope.productionPlans[index].remark;
					product.productionPlanId = $scope.productionPlans[index].id;
					productQualityParts.push(product);
				}
			 var data = {
					 productQualityParts:productQualityParts
			 };
			 console.log("Data",data);
			 
			 utils.showProgressBar();
				var httpparams = {};
				httpparams.method = 'POST';
				httpparams.url = SERVER_URL + "productquality/productQualityCheck";
				httpparams.data = data;
				httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};

				$http(httpparams).then(function successCallback(data) {
					if(data.data.code === 1){
						utils.showToast("Product Quality Check sucessfully!");
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
		}
		
	
});
		