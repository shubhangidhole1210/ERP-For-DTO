erpApp.controller('productStoreCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils, $location){
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
			httpparams.url = SERVER_URL + "productionplanning/getProductionPlanReadyListByDate/"+ $scope.currentDate;
			httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(function successCallback(response) {
				utils.hideProgressBar();
				$scope.productionPlans = response.data.data;
				console.log("$scope.productionPlans : " ,$scope.productionPlans);
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();
			});
	  };
	
	  $scope.submitInformation = function(isvaliduser, $event) {
			if (isvaliduser) {
				$scope.saveProductQuality();
			} else {
				console.log('its else block');
				utils.showToast('Please fill all required information');
			}
		};
	  
		$scope.saveProductQuality=function(){
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
			/* utils.showProgressBar();*/
				var httpparams = {};
				httpparams.method = 'POST';
				httpparams.url = SERVER_URL + "productquality/productQualityCheckStore";
				httpparams.data = data;
				httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
				$http(httpparams).then(function successCallback(data) {
					console.log(data.data.message);
					console.log(data);
					if (data.data.code === 1) {
						utils.showToast("Product Store sucessfully!");
					} else {
						utils.showToast("Something went wrong. Please try again later.");
					}
					/*utils.hideProgressBar();*/
				}, function errorCallback(response) {
					utils.showToast("Something went wrong. Please try again later.");
					console.log("Error");
				});
				utils.showConfirm();
		};
		
		$scope.validatePassQuantity = function(qualityCheckedQuantity,passQuantity,$index){
			console.log("qualityCheckedQuantity : " , qualityCheckedQuantity);
			console.log("passQuantity : ",passQuantity);
			if(qualityCheckedQuantity === passQuantity){
				$scope.productStoreForm["passQuantity" + $index].$setValidity("customMsg", true);
			}else{
				$scope.productStoreForm["passQuantity" + $index].$setValidity("customMsg", false);
			}
		}
		
		/*$scope.showConfirm = function(ev,$index) {
			var confirm = $mdDialog.confirm().title('You want to back home page else same page?')
					.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

			$mdDialog.show(confirm)
					.then(function() {
						$location.path('/home');
					}, function() {});
		};*/
		
		$scope.cancelProductStore=function(){
			$location.path('/');
		};
});
		