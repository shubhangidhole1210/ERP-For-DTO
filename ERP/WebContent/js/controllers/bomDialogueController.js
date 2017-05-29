erpApp.controller('bomDialogueController', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils){
		
	
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
			rmVendorList.push(rmVendor)
		
		var data = {
				product : $scope.product.product.id,
				bomId:"BOM0001", 
				bomModelParts : rmVendorList
			};
	    	 
	    	/*var httpparams = {};
	    	if($scope.flag === 0){
	    		httpparams.method = 'post';
	 			httpparams.url = SERVER_URL + "bom/createmultiple";
	 			httpparams.headers = {
	 					auth_token : Auth.getAuthToken()
	 			};
	    	}else{
	    		data.id=$scope.productRmAsso.id,
	    		httpparams.method='put',
	    		httpparams.url=SERVER_URL + "productRMAsso/update/multipleProductRMAssociation"
	    		httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
	    	}
	    	 
	    	httpparams.data = data;
	    	
	    	$http(httpparams).then(
				function successCallback(data) {
					$mdDialog.hide();
					console.log(data);
					if(data.data.code === 0){
						console.log(data.data.message);
						console.log(data);
						$scope.hide();
						utils.showToast('Something went worng. Please try again later.');
					}
					
					else{
						$scope.displayProgressBar = false;
						utils.showToast('Product RM Association Information saved successfully.');
					}
				},
				function errorCallback(data) {
					$rootScope.$emit("saveVendorError", {});
					console.log(data);
					$scope.hide();
					utils.showToast('Something went worng. Please try again later.');
				});*/
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
					/*$location.path('/');*/
				}else{
					utils.showToast(data.data.message);
					/*$location.path('/');*/
				}
				utils.hideProgressBar();
				
			}, function errorCallback(response) {
				console.log("Error");
				utils.showToast("Something went wrong. Please try again later.");
				utils.hideProgressBar();
			});
			utils.showProgressBar();
		}
		
		/*$scope.cancelDispatchQuantityForm=function(){
			$location.path('/');
		}*/
	}
	
	
	  $scope.cancel = function() {
	      $mdDialog.cancel();
	  };

	  $scope.answer = function(answer) {
	      $mdDialog.hide(answer);
	  };
	
	  $scope.hide = function() {
	      $mdDialog.hide();
	  };

	
});