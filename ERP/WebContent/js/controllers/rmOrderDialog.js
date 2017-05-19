erpApp.controller('rmOrderDialogCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,flag,action,title,rmOrder,utils,hideAction,priceAction,vendorAction){
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.rmOrder = rmOrder;
	$scope.isPriceReadOnly = priceAction;
	$scope.isVendorId = vendorAction;
	$scope.rmOrder.actualPrice = $scope.rmOrder.actualPrice ? $scope.rmOrder.actualPrice : 0;
	$scope.rmOrder.tax = $scope.rmOrder.tax ? $scope.rmOrder.tax : 0;
	$scope.rmOrder.totalprice = $scope.rmOrder.totalprice ? $scope.rmOrder.totalprice : 0;
	$scope.rmOrder.otherCharges = $scope.rmOrder.otherCharges ? $scope.rmOrder.otherCharges : 0;
	$scope.title = title;
	$scope.displayAddRM = hideAction;
	$scope.rmOrder.expectedDeliveryDate = new Date($scope.rmOrder.expectedDeliveryDate);
	
	$scope.hide = function() {
		console.log('hide DialogController');
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};

	$scope.saveRMOrder = function(ev) {
		
		
		var data = {
				rawmaterialorderassociations:$scope.orderRawMaterials,
				name:$scope.rmOrder.name,
				description:$scope.rmOrder.description,
				quantity:$scope.rmOrder.quantity,
				/*vendor:$scope.selectedVendor,*/
				vendor:$scope.rmOrder.vendor.id,
				totalprice:$scope.rmOrder.totalprice,
				tax:$scope.rmOrder.tax,
				otherCharges:$scope.rmOrder.otherCharges,
				actualPrice:$scope.rmOrder.actualPrice
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.rmOrder);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "rawmaterialorder/createmultiple";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.rmOrder);
			data.id = $scope.rmOrder.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "rawmaterialorder/update";
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
								utils.showToast('Raw Material Order Created successfully.');
								$rootScope.$emit("CallPopulateRMOrderList",{});
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
	
	/* $scope.$watch('selectedVendor', function(newVal, oldVal) {
		 $scope.rmOrder.totalPrice="";
		 $scope.rmOrder.actualPrice="";
		 $scope.rmOrder.tax="";
		 $scope.rmOrder.otherCharges="";
	 });*/
	 
	 
	 
	/* if(flag==0)
		 {
		 $scope.$watch('selectedVendor', function(newVal, oldVal) {
			 $scope.rmOrder.totalPrice="";
			 $scope.rmOrder.actualPrice="";
			 $scope.rmOrder.tax="";
			 $scope.rmOrder.otherCharges="";
		 });
		 }*/
	
	$scope.updateQuantity = function(quantity){
		console.log("in update quantity function");
		console.log("upadted quantity : " + quantity);
		console.log()
	}

	$scope.submitRMOrderInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveRMOrder();
			
		} else {
			console.log('its else block');
		}

	}
	$scope.vendorRmList=function(index)
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterial/getRMaterial/" + $scope.rmOrder.vendor.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.vendorRmList = response.data;

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		})
	};
	$scope.otherCharges=0;
	$scope.productSubTotal = 0;
	var TAX = 0.18;
	$scope.calculateTotalPrice=function(){
		
		console.log($scope.orderRawMaterials);
		for (var i = 0; i < $scope.orderRawMaterials.length; i++){
		   $scope.productSubTotal = $scope.orderRawMaterials[i].rawmaterial.pricePerUnit * $scope.orderRawMaterials[i].quantity;
		  /* $scope.productSubTotal += $scope.totalPrice;*/
		}
		console.log('Product Sub Total : '+$scope.productSubTotal);
		$scope.rmOrder.actualPrice = $scope.productSubTotal;
		$scope.rmOrder.tax = $scope.productSubTotal * TAX;
		console.log('Tax Sub Total : '+$scope.rmOrder.tax);
		$scope.rmOrder.totalprice = $scope.rmOrder.actualPrice + $scope.rmOrder.tax + $scope.rmOrder.otherCharges;
		console.log('Total Price : '+ $scope.rmOrder.totalprice);
	}
	
	$scope.updateOtherCharges=function()
	{
		console.log('in update other charges');
		console.log('Other Charges : '+$scope.rmOrder.otherCharges);
		$scope.rmOrder.totalprice = $scope.rmOrder.actualPrice + $scope.rmOrder.tax + $scope.rmOrder.otherCharges;
		console.log('Total Price : '+$scope.rmOrder.totalprice);
		/*console.log('actual price : ' +)*/
	}
	
	$scope.updateQuantity = function(quantity){
		console.log("in update quantity function");
		console.log("upadted quantity : " + quantity);
		console.log("total price : " +$scope.rmOrder.totalprice);
		console.log("actual price : " + $scope.rmOrder.actualPrice);
		console.log("tax price : " + $scope.rmOrder.tax);
		console.log("other charges : " + $scope.rmOrder.otherCharges);
		console.log("product sub total : " + $scope.productSubTotal);
		$scope.productSubTotal = $scope.productSubTotal * quantity;
		console.log("aftera added updated quantity : " + $scope.productSubTotal);
		
		
		
	}
	
	 
	
	$scope.displayVendorId=function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "vendor/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.vendorData = response.data;

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		})
	};
	
	
	
	
	
	 $scope.orderRawMaterials=[];
	    $scope.orderRawMaterial={isActive : true};
	    $scope.addOrderRawMaterial = function(){
	    	console.log('Adding RM : ', $scope.orderRawMaterial);
	    	if( !angular.equals($scope.orderRawMaterial,{}) ){
	    		if(!$scope.isDuplicateRM($scope.orderRawMaterial)){
				   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
				   $scope.orderRawMaterial = {isActive : true};
				   $scope.RMOrderInformation.rawmaterial.$setValidity("message", true);
				   console.log('setting validity true')
				   $scope.message="";
	    		}else{
	    			$scope.message = 'This Rawmaterial is already added';
					$scope.RMOrderInformation.rawmaterial.$setValidity("message", false);
	    		}
			}
	    	$scope.calculateTotalPrice();
	    };
	    
	
	    $scope.isDuplicateRM = function(orderRawMaterial) {
			for (var i = 0; i < $scope.orderRawMaterials.length; i++) {
				if ($scope.orderRawMaterials[i].rawmaterial.id === orderRawMaterial.rawmaterial.id) {
					return true;
				}
			}
			return false;
		};
	    
	    $scope.deleteRM=function(index)
	    {
	    	console.log('in delete RM'+ $scope.orderRawMaterials)
	    	var lastItem = $scope.orderRawMaterials.length;
		    $scope.orderRawMaterials.splice(index,1);
		    $scope.calculateTotalPrice();
	    }
	    
	  
	    
	   /* $scope.addQuantity = function(quantity) {
			if (quantity <= 0) {
				console.log('if condition')
				$scope.message = 'quantity should be greater than 0';
				$scope.RMOrderInformation.quantity.$setValidity("message", false);
			} else {
				$scope.RMOrderInformation.quantity.$setValidity("message", true);
			}
		};*/
	    
		$scope.$watch('vendorId', function(val)
				{
				    if (!val) $scope.vendorId = null;
				});
	    
	    
	    $scope.getRmForOrder=function(){
	    	if($scope.rmOrder.id){
		    	var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "rawmaterialorderassociation/getRMForRMOrder/"+ $scope.rmOrder.id;
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
				
				$http(httpparams).then(function successCallback(response) {
					$scope.rmOrderList = response.data;
					console.log(response);
		            console.log($scope.rmOrderList);
				}, function errorCallback(response) {
					console.log("Error");
				});
	    	}
	    };
});