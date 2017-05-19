erpApp.controller('storeOutCtrl',function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location)
{
	$scope.currentDate = utils.getCurrentDate();
	/*$scope.manuFactureQuantity = 0;*/
	$scope.productionPlan = {};
	$scope.getProducts=function()
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListByDate/" +$scope.currentDate;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
		/*	$scope.data = response.data;*/
			$scope.productionPlans = response.data;
			console.log(response);
			utils.hideProgressBar();

		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();

		});
	}
	
	
	
	$scope.getProductRMAssociation=function($index)
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListForStoreOutByDateAndPId/"  +$scope.currentDate  + "/" + +$scope.productionPlan.product.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.productRMList = response.data.data;
			console.log(response);
			utils.hideProgressBar();

		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();

		});
	}
	
	$scope.updateDispatchQuantity = function(){
		for(index=0;index<$scope.data.data.length;index++){
			$scope.data.data[index].quantityDispatched = $scope.data.data[index].quantityRequired * $scope.manuFactureQuantity;
		}
	};
	
	$scope.saveStoreOutInformation=function()
	{
		
		console.log($scope.data.data);
		var index=0;
		var rmList = [];
		for(index=0;index<$scope.data.data.length;index++){
			var storeOutProduct = {};
			storeOutProduct.rawmaterial= $scope.data.data[index].rawmaterial;
			storeOutProduct.quantityRequired = $scope.data.data[index].quantityRequired;
			storeOutProduct.quantityDispatched = $scope.data.data[index].quantityDispatched;
			
			rmList.push(storeOutProduct);
		}
		data=
			{
				productId: $scope.productionPlan.product.id,
				productionPlanId :$scope.productionPlan.id,
				quantityRequired: $scope.manuFactureQuantity,
				description:$scope.description,
				storeOutParts:rmList
			};
		var httpparams = {
				method : 'post',
				url : SERVER_URL + "storeout/createStoreOut",
				data : data
			};
		
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			console.log(data);
			if(data.data.code === 1){
				utils.showToast(data.data.message);
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
	
	
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveStoreOutInformation();
		} else {
			console.log('its else block');
		}
	};
	
	$scope.restInformation=function(){
		$location.path('/');
	}
	
	
	});
