erpApp.controller('prodcutQualityCheckCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils){
	 $scope.currentDate = new Date();
	 
	  $scope.selectedProductionPlan = {};
	  $scope.QCPassQuantity = 0;
	  $scope.QCFailQuantity = 0;
	  $scope.reamrk = '';
	  $scope.curr_date = $scope.currentDate.getDate();
	  $scope.curr_month = $scope.currentDate.getMonth() + 1; //Months are zero based
	  $scope.curr_year = $scope.currentDate.getFullYear();
	  $scope.currentDate =  $scope.curr_year + "-" + $scope.curr_month + "-" +  $scope.curr_date;
	  console.log( $scope.currentDate); 
	  
	  $scope.getProductionPlanByDate=function(){
		  utils.showProgressBar();
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productionplanning/getProductionPlanByDate/"+ $scope.currentDate;
			
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
	  $scope.getProductionPlanByDateAndPId=function(index) {
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
	  };
	  
	  $scope.submitProductQualityCheckInformation = function(isvaliduser, $event) {
			if (isvaliduser) {
				utils.showProgressBar();
				$scope.updateProductQuality();
			} else {
				console.log('its else block');
			}
		};
		
		$scope.updateProductQuality=function()
		{
			 var data = {
					 product: $scope.selectedProductionPlan.product.id,
					 productionplanning: $scope.selectedProductionPlan.id,
					 checkQuantity: $scope.selectedProductionPlan.targetQuantity,
					 goodQuantity: $scope.QCPassQuantity,
					 rejectedQuantity: $scope.QCFailQuantity,
					 remark: $scope.remark,
					 createdBy: 2,
					 created_date: null,
					 updatedBy: 1,
					 updated_date: null,
					 isactive: true
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

				$http(httpparams).then(function successCallback(response) {
					utils.hideProgressBar();
//					$scope.productsPlan = response.data;
					console.log("productQualityCheck response : ",response);
				}, function errorCallback(response) {
					console.log("Error");
					utils.hideProgressBar();
				});
		}
		
		$scope.checkProductQuanitity=function()
		{
			
		}
	
});
		