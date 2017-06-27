erpApp.controller('storeOutCtrl',function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location)
{
	$scope.addProductRmAssociationMsg = false;
	$scope.currentDate = utils.getCurrentDate();
	$scope.isProduct = false;
	$scope.productionPlan = {};
	$scope.getProductionPlanForStoreOut = function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListByDate/" +$scope.currentDate;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.productionPlans = response.data;
			console.log(response);
			utils.hideProgressBar();
			$scope.isProductOrderPresent();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	$scope.isProductOrderPresent = function(){
		$scope.isProduct = $scope.productionPlans.length ===0?true : false;
	}
	
	$scope.getProductRMAssociation = function(){
		
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productionplanning/getProductionPlanListForStoreOutByDateAndPId/"  + $scope.currentDate + "/" + + $scope.productionPlan.product.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			
//			$scope.data = response.data;
			
			if(response.data.code === 0){
				utils.showToast(response.data.message);
				console.log(response.data.message);
				$scope.addProductRmAssociationMsg = true;
			}else{
				$scope.productRMList = response.data.data;
				console.log(response);
				$scope.manuFactureQuantity = $scope.productionPlan.targetQuantity;
				console.log("Target Qty : ", $scope.productionPlan.targetQuantity);
				$scope.updateDispatchQuantity();
			}
			utils.hideProgressBar();
			

		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	$scope.updateDispatchQuantity = function(){
		for(index=0;index<$scope.productRMList.length;index++){
			$scope.productRMList[index].quantityDispatched = $scope.productRMList[index].quantityRequired * $scope.manuFactureQuantity;
		}
	};
	
	$scope.saveStoreOutInformation=function(){
		//console.log($scope.data.data);
		var index=0;
		var rmList = [];
		for(index=0;index<$scope.productRMList.length;index++){
			var storeOutProduct = {};
			storeOutProduct.rawmaterial= $scope.productRMList[index].rawmaterial;
			storeOutProduct.quantityRequired = $scope.productRMList[index].quantityRequired;
			storeOutProduct.quantityDispatched = $scope.productRMList[index].quantityDispatched;
			rmList.push(storeOutProduct);
		}
		var data = {
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
	};
	
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveStoreOutInformation();
		} else {
			console.log('its else block');
		}
	};
	
	$scope.restInformation=function(){
		$location.path('/');
	};
	
	});
