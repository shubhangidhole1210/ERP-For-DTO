erpApp.controller('productOrderDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,productOrder,utils,flag,action,information,hideAction,clientAction) {
	  
	$scope.productOrder=productOrder;
    $scope.flag=flag;
    $scope.isReadOnly = action;
    $scope.information = information;
    $scope.isProductOrderAdd = hideAction;
    $scope.isClientReadOnly = clientAction;
    $scope.productOrder.expecteddeliveryDate = new Date($scope.productOrder.expecteddeliveryDate);
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    
    $scope.saveProductOrder=function(ev)
    {
    	
    	var data = {
    			 orderproductassociations : $scope.orderproductassociations,
    			 description:$scope.productOrder.description,
    			 invoiceNo:$scope.productOrder.invoiceNo,
    			 expecteddeliveryDate:$scope.productOrder.expecteddeliveryDate ,
    			  client:$scope.productOrder.client.id
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.productOrder);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "productorder/createmultiple";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			 data.id=$scope.productOrder.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "productorder/update";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		}
		
		httpparams.data = data;
		$http(httpparams)
				.then(
						function successCallback(data) {
							$mdDialog.hide();
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveRMOrderError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
							}else{
								$scope.displayProgressBar = false;
								utils.showToast('Product Order Created successfully.');
								$rootScope.$emit("callPopulateProductOrderList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveRMOrderError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
    	
    	 
    }
    
  
	
	
	$scope.submitInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			
			$scope.saveProductOrder($event);
		} else {
			console.log('its else block');
		}

	}
    
   
	
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
	    
    
	    
	   /* $scope.orderproductassociations=[];
	    $scope.orderProductAssociation={isActive : true};
	    $scope.addOrderProductAssociation=function(){
	    	if(!angular.equals($scope.orderProductAssociation,{})){
				   $scope.orderproductassociations.push($scope.orderProductAssociation);	
				   $scope.orderProductAssociation = {isActive : true};
				   console.log($scope.orderProductAssociations);
				   console.log($scope.orderProductAssociation);
			}
	    };
	    
	    $scope.isDuplicateRM = function(orderProductAssociation) {
			for (var i = 0; i < $scope.orderproductassociations.length; i++) {
				if ($scope.orderRawMaterials[i].rawmaterial.id === orderRawMaterial.rawmaterial.id) {
					return true;
				}
			}
			return false;
		};*/
	    
	    $scope.orderproductassociations=[];
	    $scope.orderProductAssociation={isActive : true};
	    $scope.addOrderProductAssociation = function(){
	    	console.log('Adding RM : ', $scope.orderProductAssociation);
	    	if( !angular.equals($scope.orderProductAssociation,{}) ){
	    		if(!$scope.isDuplicateRM($scope.orderProductAssociation)){
				   $scope.orderproductassociations.push($scope.orderProductAssociation);	
				   $scope.orderProductAssociation = {isActive : true};
				   $scope.productOrderInformation.product.$setValidity("message", true);
				   console.log('setting validity true')
				   $scope.message="";
	    		}else{
	    			$scope.message = 'This Product is already added';
					$scope.productOrderInformation.product.$setValidity("message", false);
	    		}
			}
	    };
	    
	
	    $scope.isDuplicateRM = function(orderProductAssociation) {
			for (var i = 0; i < $scope.orderproductassociations.length; i++) {
				if ($scope.orderproductassociations[i].product.id === orderProductAssociation.product.id) {
					return true;
				}
			}
			return false;
		};
	    
	    
	    
	    
	    
	    
	    
	    $scope.deleteProduct=function(index)
	    {
	    	console.log('delted products' +  $scope.orderproductassociations)
	    	var lastItem = $scope.orderproductassociations.length;
		    $scope.orderproductassociations.splice(index,1);
	    }
	    
	    $rootScope.isAddButtonDisplay=true;
	    $scope.getProductOrderId=function()
	    {
	    	if($scope.productOrder.id){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "productorder/productorderId/"+ $scope.productOrder.id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			
			$http(httpparams).then(function successCallback(response) {
				$scope.productOrderList = response.data;
				console.log(response);
	             console.log('product order list' + $scope.productOrderList);
			}, function errorCallback(response) {
				console.log("Error");
			});
	   }
	    }
	    
	  $scope.orderDateValidation = function(expecteddeliveryDate){
		  console.log("expected deliver date" + expecteddeliveryDate);
		  $scope.currentDate = new Date();
		  console.log("current date" +  $scope.currentDate);
		  if(expecteddeliveryDate <= $scope.currentDate){
			  console.log("its if condition")
			  $scope.msg="Date should be greater then current date"
			  $scope.productOrderInformation.expecteddeliveryDate.$setValidity("customeMsg", false);
		  }else{
			     console.log("its else block")
			     $scope.productOrderInformation.expecteddeliveryDate.$setValidity("customeMsg", true);
		  }
			  
			  
	  }
	    
	    
	   
});