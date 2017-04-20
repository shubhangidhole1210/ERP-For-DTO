erpApp.controller('productRmAssociationDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,flag,action,information,productRmAsso) {
	  $scope.productRmAsso = productRmAsso;
	  console.log(productRmAsso);
	  if(angular.equals($scope.productRmAsso,{})){
		  $scope.productRmAsso.productRMAssociationModelParts = [];
	  }
	  
	  $scope.rawmaterialPart = {};
	  $scope.flag = flag;
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
	    
	  $scope.saveProductRMAssociationInfo = function() {
    	var data = {
    		product : $scope.productRmAsso.product,
    		productRMAssociationModelParts: $scope.productRmAsso.productRMAssociationModelParts
		};
    	 
    	var httpparams = {};
    	if($scope.flag === 0){
    		httpparams.method = 'post';
 			httpparams.url = SERVER_URL + "productRMAsso/createmultiple";
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
				$rootScope.$emit("saveVendorError", {});
				console.log(data);
				$scope.hide();
				utils.showToast('Something went worng. Please try again later.');
			});
    	 
    	};
	    
	    $scope.submitProductRMAssociationInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveProductRMAssociationInfo();
			} else {
				console.log('its else block');
			}

		};
	    
	   
	    $scope.deleteRM = function(index){
	    	console.log('in delete RM'+ $scope.productRmAsso.productRMAssociationModelParts)
		    $scope.productRmAsso.productRMAssociationModelParts.splice(index,1);
	    };
		
		$scope.rawMaterialId = function(){
			
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
		 
	    $scope.addRawMaterial = function(){
	    	console.log('Adding RM : ', $scope.rawmaterialPart);
	    	if( !angular.equals($scope.rawmaterialPart,{}) ){
	    		if(!$scope.isDuplicateRM($scope.rawmaterialPart)){
				   $scope.productRmAsso.productRMAssociationModelParts.push($scope.rawmaterialPart);	
				   $scope.rawmaterialPart = {};
				   $scope.productRMAssociationInformation.rawmaterial.$setValidity("message", true);
				   console.log('setting validity true')
				   $scope.message="";
	    		}else{
	    			$scope.message = 'This Rawmaterial is already added';
					$scope.productRMAssociationInformation.rawmaterial.$setValidity("message", false);
	    		}
			}
	    };
		
		$scope.getProducts = function() {
			 var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "product/list/newProductRMAssociation";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
			 $http(httpparams).then(function successCallback(response) {
					$scope.data = response.data;
					$scope.products = response.data.data;
					console.log(response);
				}, function errorCallback(response) {
					console.log("Error");
				});
		};
		    
		$scope.addQuantity = function(quantity) {
			if (quantity <= 0) {
				console.log('if condition')
				$scope.message = 'quantity should be greater than 0';
				$scope.productRMAssociationInformation.quantity.$setValidity("message", false);
			} else {
				$scope.productRMAssociationInformation.quantity.$setValidity("message", true);
			}
		};
		
		$scope.isDuplicateRM = function(orderRawMaterial) {
			for (var i = 0; i < $scope.productRmAsso.productRMAssociationModelParts.length; i++) {
				if ($scope.productRmAsso.productRMAssociationModelParts[i].rawmaterial.id === orderRawMaterial.rawmaterial.id) {
					return true;
				}
			}
			return false;
		};
								
});