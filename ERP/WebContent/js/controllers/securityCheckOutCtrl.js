erpApp.controller('securityCheckOutCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location) {
	
	 $scope.getClient=function(){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "client/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		 $http(httpparams).then(function successCallback(response) {
				$scope.clients = response.data;

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			});
	    };
	    
	    $scope.clientProductOrder=function(index)
		{
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productorder/incompleteProductOrder/"+$scope.selectedClient;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
					
				};
			
			$http(httpparams).then(function successCallback(response) {
				$scope.clientProductList = response.data;
				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");
			})
		}
	    $scope.displayProductList = function(index) {
			console.log($scope.rawMaterials);
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productorder/productorderId/"+ $scope.productOrders.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			
			$http(httpparams).then(function successCallback(response) {
				$scope.productOtderList = response.data;
				console.log(response);
	             console.log($scope.rawMaterialList)
	             utils.hideProgressBar();
			}, function errorCallback(response) {
				console.log("Error");
				utils.hideProgressBar();

			});
			utils.showProgressBar();
		}
	
});
