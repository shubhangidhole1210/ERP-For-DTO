erpApp.controller('productRmAssociationDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,flag,action,information,productRmAsso,productAction,$q, $log) {
	  $scope.productRmAsso = productRmAsso;
	  console.log("Product RM Association : ", productRmAsso);
	  if(angular.equals($scope.productRmAsso,{})){
		  $scope.productRmAsso.productRMAssociationModelParts = [];
	  }
	  
	  $scope.rawmaterialPart = {};
	  $scope.flag = flag;
	  $scope.isReadOnly = action;
	  $scope.productIdReadOnly = productAction;
	  $scope.information = information;
	  $scope.isRMTypeSelected = true;
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
    		httpparams.url=SERVER_URL + "productRMAsso/update/multipleProductRMAssociation";
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
//					$rootScope.$emit(
//							"saveVendorError", {});
					console.log("Update Multiple ProductRM Association : " , data);
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
				utils.showToast('Please fill all required information');
			}
		};
	    
		$scope.submitRm=function(isvaliduser,$event){
			if (isvaliduser) {
				$scope.addRawMaterial();
			} else {
				console.log('its else block');
				utils.showToast('Please fill all required information');
			}
		};
	   
	    $scope.deleteRM = function(index){
	    	console.log('in delete RM'+ $scope.productRmAsso.productRMAssociationModelParts);
		    $scope.productRmAsso.productRMAssociationModelParts.splice(index,1);
	    };
		
		/*$scope.rawMaterialId = function(){
			console.log("Getting RM List");
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rawmaterial/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(function successCallback(response) {
				$scope.RMData = response.data;
				console.log("RM List : ", response);
			}, function errorCallback(response) {
				console.log("Error");
			});
		};*/
	    
	    $scope.getRawMtaerialByRmType = function(index){
	    	console.log("Getting RM List");
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rawmaterial/getRMaterialList/" + $scope.RMTypeId.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
			};
			$http(httpparams).then(function successCallback(response) {
				$scope.rawMtaerials = response.data;
				console.log("RM List : ", response);
				  $scope.isRMTypeSelected = false;
			}, function errorCallback(response) {
				console.log("Error");
			});
	    };
		  
	    $scope.addRawMaterial = function(){
	    	console.log('Adding RM : ', $scope.rawmaterialPart);
	    	if( !angular.equals($scope.rawmaterialPart,{}) ){
	    		if(!$scope.isDuplicateRM($scope.rawmaterialPart)){
				   $scope.productRmAsso.productRMAssociationModelParts.push($scope.rawmaterialPart);	
				   $scope.rawmaterialPart = {};
				   console.log('setting validity true');
				   $scope.productRMAssociationInformation.rawmaterial.$setValidity("message", true);
				   $scope.message="";
	    		}else{
	    			$scope.message = 'This Rawmaterial is already added';
					$scope.productRMAssociationInformation.rawmaterial.$setValidity("message", false);
	    		}
			}
	    };
	    
	    function getProductListURL(){
	    	return ($scope.flag === 0) ? "product/list/newProductRMAssociation" : "product/list";
	    };
	    
	    $scope.getProducts = function() {
	    	console.log("Getting Products");
	    	$scope.flag === 0 ? $scope.getProductsWithoutRMAssociation() : $scope.getAllProducts();
		};
	    
	    $scope.getProductsWithoutRMAssociation = function() {
	    	
	    	console.log("Getting Products without RM Association");
			 var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "product/list/newProductRMAssociation";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
			 $http(httpparams).then(function successCallback(response) {
//					$scope.data = response.data;
					$scope.products = response.data.data;
					console.log("Products without RM Association : ", response);
					 				
				}, function errorCallback(response) {
					console.log("Error");
				});
		};
		
		
		
		$scope.getAllProducts = function() {
			console.log("Getting All Products");
			 var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "product/list";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
			 $http(httpparams).then(function successCallback(response) {
//					$scope.data = response.data;
					$scope.products = response.data;
					console.log("Product List : ", response);
									
				}, function errorCallback(response) {
					console.log("Error");
				});
		};
		
	  
	   
		$scope.addQuantity = function(quantity) {
			if (quantity <= 0) {
				console.log('if condition');
				$scope.addQuantityMsg = 'quantity should be greater than 0';
				$scope.productRMAssociationInformation.quantity.$setValidity("message", false);
			} else {
				$scope.productRMAssociationInformation.quantity.$setValidity("message", true);
			}
		};
		
		$scope.isDuplicateRM = function(orderRawMaterial){
			for (var i = 0; i < $scope.productRmAsso.productRMAssociationModelParts.length; i++) {
				if ($scope.productRmAsso.productRMAssociationModelParts[i].rawmaterial.id === orderRawMaterial.rawmaterial.id) {
					return true;
				}
			}
			return false;
		};
		
		$scope.getRmTypeList= function(){
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rmtype/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(response) {
				$scope.rmTypes = response.data;
				console.log("$scope.rmType : " ,$scope.rmTypes);
				/*$scope.isUnitPresent();*/
			}, function errorCallback(response) {
				console.log("Error");
			});
		};
		
	
	   
		$scope.simulateQuery = false;
	    $scope.isDisabled    = false;

	    $scope.states        = loadAll();
	    $scope.querySearch   = $scope.querySearch;
	    $scope.selectedItemChange = selectedItemChange;
	    $scope.searchTextChange   = searchTextChange;

	    $scope.newState = $scope.newState;

	    $scope.newState = function(state) {
	      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
	    }
	    $scope.querySearch = function(query) {
	    	console.log('querySearch : ', query);
	    	
	      var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
	          deferred;
	      if ($scope.simulateQuery) {
	        deferred = $q.defer();
	        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
	        return deferred.promise;
	      } else {
	        return results;
	      }
	    }

	    function searchTextChange(text) {
	      $log.info('Text changed to ' + text);
	    }

	    function selectedItemChange(item) {
	      $log.info('Item changed to ' + JSON.stringify(item));
	    }

	    function loadAll() {
	    	console.log("in load all function");
	    	
	      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
	              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
	              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
	              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
	              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
	              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
	              Wisconsin, Wyoming';

	      return allStates.split(/, +/g).map( function (state) {
	        return {
	          value: state.toLowerCase(),
	          display: state
	        };
	      });
	    }

	    
	    
	    function createFilterFor(query) {
	      var lowercaseQuery = angular.lowercase(query);

	      return function filterFn(state) {
	        return (state.value.indexOf(lowercaseQuery) === 0);
	      };

	    }

		
		
});
