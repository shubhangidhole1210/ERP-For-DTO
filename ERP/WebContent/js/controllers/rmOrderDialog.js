erpApp.controller('rmOrderDialogCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,flag,action,title,rmOrder,utils,hideAction){
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.rmOrder = rmOrder;
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
				/*expectedDeliveryDate:$scope.rmOrder.expectedDeliveryDate,*/
				vendor:$scope.selectedVendor,
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
								/*$scope.message = 'Raw Material Order Created successfully.';
								$scope.showToast();*/
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

	$scope.submitRMOrderInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			/*utils.showProgressBar();*/
			$scope.saveRMOrder();
			
		} else {
			console.log('its else block');
		}

	}
	$scope.vendorRmList=function(index)
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterial/getRMaterial/"+$scope.selectedVendor;
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
	$scope.calculateTotalPrice=function(){
		 $scope.productSubTotal=0;
		console.log($scope.orderRawMaterials);
		var i;
		for (i = 0; i < $scope.orderRawMaterials.length; i++)
			{
			   $scope.totalPrice=$scope.orderRawMaterials[i].rawmaterial.pricePerUnit * $scope.orderRawMaterials[i].quantity;
			   $scope.productSubTotal += $scope.totalPrice;
			   console.log('product sub total'+$scope.productSubTotal);
			   $scope.tax= $scope.productSubTotal*0.18;
			   console.log('tax'+ $scope.tax);
			   $scope.taxActualPrice=$scope.tax+ $scope.productSubTotal ;
			   console.log('total Prices'+ $scope.taxActualPrice);
			 
			}
	}
	
	$scope.updateOtherCharges=function()
	{
		console.log('in update other charges')
		$scope.totalPrices= $scope.taxActualPrice+$scope.otherCharges;
		console.log('total prices'+$scope.totalPrices)
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
	    $scope.addOrderRawMaterial=function(){
	    	if(!angular.equals($scope.orderRawMaterial,{})){
				   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
				   $scope.orderRawMaterial = {isActive : true};
				   console.log($scope.orderRawMaterials);
			}
	    	$scope.calculateTotalPrice();
	    };
	
	$scope.isDuplicateRM=function()
	{
		  console.log($scope.orderRawMaterials)
		var i;
		var j;
						for (i = 0; i < $scope.orderRawMaterials.length; i++) {
							for (j = 0; i < $scope.orderRawMaterials.length; j++) {
								if (i != j) {
									if ($scope.orderRawMaterials[i].id == $scope.orderRawMaterials[j].id) {
										$scope.orderRawMaterials = $scope.orderRawMaterials.splice(j,1);
										return true;
									}
								}
							}
						}
						return false;
	}
	    
	    $scope.deleteRM=function(index)
	    {
	    	console.log('in delete RM'+ $scope.orderRawMaterials)
	    	var lastItem = $scope.orderRawMaterials.length;
		    $scope.orderRawMaterials.splice(index,1);
	    }
	    
	    
	    
	    $scope.getRmForOrder=function(index)
	    {
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
});