erpApp.controller('productRmAssociationDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,flag,action,information,productRmAsso) {
	  $scope.productRmAsso=productRmAsso;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.information = information;
	    $scope.hide = function() {
	      $mdDialog.hide();
	    };

	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

	    $scope.answer = function(answer) {
	      $mdDialog.hide(answer);
	    };
	    
	    $scope.saveProductRMAssociationInfo=function()
	    {
	    	 var data = {
	    		product : $scope.productRmAsso.product.id,
	    		productRMAssociationModelParts: $scope.orderRawMaterials
				};
	    	 
	    	
	    	 var httpparams = {};
	    	 if($scope.flag==0)
	    		 {
	    		 httpparams.method = 'post';
	 			httpparams.url = SERVER_URL + "productRMAsso/createmultiple";
	 			httpparams.headers = {
	 					auth_token : Auth.getAuthToken()
	 				};
	    		 }
	    	 else
	    		 {
	    		      data.id=$scope.productRmAsso.id,
	    		      httpparams.method='put',
	    		      httpparams.url=SERVER_URL + "productRMAsso/update"
	    		      httpparams.headers = {
	    						auth_token : Auth.getAuthToken()
	    					};
	    		 }
	    	 
	    	 httpparams.data=data;
	    	 $http(httpparams).then(
						function successCallback(data) {
							$mdDialog.hide();
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
							}
							
							else{
								$scope.displayProgressBar = false;
								utils.showToast('Product RM Association Information saved successfully.');
								$rootScope.$emit("callPopulateProductRmAssociationList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveVendorError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	    	 
	    }
	   
		
		
		$scope.rawMaterialId=function()
		{
			
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rawmaterial/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(response) {
				$scope.RMData = response.data;

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			})
			
		};
		
		 $scope.orderRawMaterials=[];
		    $scope.orderRawMaterial={};
		    $scope.addOrderRawMaterial=function(){
		    	if(!angular.equals($scope.orderRawMaterial,{})){
					   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
					   $scope.orderRawMaterial = {};
					   console.log($scope.orderRawMaterials);
				}
		    };
		
		
		 $scope.getProducts=function()
		    {
			 var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "product/list";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
			 $http(httpparams).then(function successCallback(response) {
					$scope.products = response.data;
			

					console.log(response);

				}, function errorCallback(response) {
					console.log("Error");

				});
		    };
});