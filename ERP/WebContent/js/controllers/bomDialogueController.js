erpApp.controller('bomDialogueController', function($scope, $http, $location, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils){
		
	
	$scope.getProducts = function() {
		utils.showProgressBar();
		        var httpparams = {};
		         httpparams.method = 'GET';
		         httpparams.url = SERVER_URL + "productRMAsso/list";
		        httpparams.headers = {
				      auth_token : Auth.getAuthToken()
			        };
		
					$http(httpparams).then( function successCallback(response) {
								/*$scope.data = response.data;*/
								$scope.products = response.data;
								console.log(response);
								utils.hideProgressBar();
							},
							function errorCallback(response) {
								console.log("Error");
								utils.showToast('We are Sorry. Something went wrong. Please try again later.');
								utils.hideProgressBar();
			});
	};
	
	$scope.getRMVendor = function(){
		console.log($scope.rawMaterials);
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productRMAsso/getRMVendorData/" + $scope.product.product.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.rawMaterialVendorList = response.data.data;
			console.log(response);
             utils.hideProgressBar();
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();

		});
		utils.showProgressBar();
	}
	
	$scope.submitBomInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveBomData();
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}

	};
	
	$scope.saveBomData=function(){
		console.log("in save function")
		console.log($scope.data.data);
		var index=0;
		var rmVendorList = [];
		for(index=0;index<$scope.data.data.length;index++){
			var rmVendor = {};
			rmVendor.rawmaterial= $scope.data.data[index].rawmaterial.id;
			rmVendor.vendor = $scope.data.data[index].vendor.id;
			rmVendor.pricePerUnit = $scope.data.data[index].pricePerUnit;
			rmVendor.quantity = $scope.data.data[index].quantity;
			rmVendorList.push(rmVendor)
		
		var data = {
				product : $scope.product.product.id,
				bomId: $scope.bomId, 
				bomModelParts : rmVendorList
			};
	    	 
	    	
			var httpparams = {
					method : 'post',
					url : SERVER_URL + "bom/createmultiple",
					data : data
				};
			
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
				console.log(data);
				if(data.data.code === 1){
					utils.showToast(data.data.message);
				}else{
					utils.showToast(data.data.message);
				}
				utils.hideProgressBar();
				
			}, function errorCallback(response) {
				console.log("Error");
				utils.showToast("Something went wrong. Please try again later.");
				utils.hideProgressBar();
			});
			utils.showProgressBar();
		}
	}
	
	/*$scope.hide = function() {
		console.log('hide DialogController');
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
*/
	$scope.cancelBom = function() {
		$location.path('/product');
	};
	 
	
});