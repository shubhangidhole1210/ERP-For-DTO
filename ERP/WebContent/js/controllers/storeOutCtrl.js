erpApp.controller('storeOutCtrl',function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location)
{
	$scope.currentDate = utils.getCurrentDate();
	
	$scope.getProducts=function()
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "product/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.products = response.data;
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
		httpparams.url = SERVER_URL + "productRMAsso/productRMAssoList/" +$scope.productID.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.productRMList = response.data;
			console.log(response);
			utils.hideProgressBar();

		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();

		});
	}
	
	$scope.caluclateRequiredQuantity=function(){
		
	}
	
	
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveTodaysProductionPlan();
		} else {
			console.log('its else block');
		}
	};
	
	});
