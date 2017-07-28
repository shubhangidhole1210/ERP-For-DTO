erpApp.controller('prodcutQualityCheckCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope, SERVER_URL, Auth, utils, $location){
	 $scope.currentDate = new Date();
	  $scope.selectedProductionPlan = {};
	  $scope.reamrk = '';
	  $scope.currentDate = utils.getCurrentDate();
	 
	  $scope.productQualityMsg = false;
	  
	  $scope.isQualityCheckButton =true;
	  
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
				 $scope.displayMsg();
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
	  };
	  
	  
	  $scope.displayMsg = function(){
		  $scope.productQualityMsg = $scope.productionPlans.length === 0 ? true : false;
		  $scope.isQualityCheckButton = $scope.productionPlans.length === 0 ? false : true;
	  }
	
	$scope.validatePassAndFailQuantity = function(qualityPendingQuantity, passQuantity, failQuantity1, $index){
		console.log("pending quantity : " + qualityPendingQuantity);
		console.log("pass Quantity : " + passQuantity);
		console.log("fail quantity : " + failQuantity1);
		$scope.passFailQuantity = passQuantity + failQuantity1 ;
		console.log("$scope.passFailQuantity :", $scope.passFailQuantity);
		if(qualityPendingQuantity == $scope.passFailQuantity){
			console.log("if condition");
			$scope.productQualityForm["failQuantity" + $index].$setValidity("customMsg", true);
		}else{
			console.log("else condition");
			$scope.productQualityForm["failQuantity" + $index].$setValidity("customMsg", false);
		}
	};  
	 
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
					product.productId= $scope.productionPlans[index].productId.id;
					product.productQuantity = $scope.productionPlans[index].targetQuantity;
					product.passQuantity = $scope.productionPlans[index].passQuantity;
					product.failQuantity = $scope.productionPlans[index].failQuantity1;
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
		};
		
		$scope.cancelProductQualityForm = function(){
			$location.path('/');
		};
});
		