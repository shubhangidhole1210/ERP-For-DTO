erpApp.controller('rmOrderDialogCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,flag,action,title,rmOrder,utils,hideAction,priceAction,vendorAction,nameAction){
	$scope.isReadOnly = action;
	$scope.isName = nameAction;
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
	$scope.rmMsg = true;
	$scope.rmOrder.expectedDeliveryDate = new Date($scope.rmOrder.expectedDeliveryDate);
	$scope.orderRawMaterials=[];
	$scope.orderRawMaterial={};
	$scope.otherCharges=0;
	var TAX = 0.18;
	
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
				vendor:$scope.rmOrder.vendor.id,
				totalprice:$scope.rmOrder.totalprice,
				tax:$scope.rmOrder.tax,
				otherCharges:$scope.rmOrder.otherCharges,
				actualPrice:$scope.rmOrder.actualPrice
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.rmOrder);
		/*	console.log($scope.data);*/
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
							/*console.log(data);*/
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
							utils.showToast('Please add atleast one raw material');
						});
	}
	
	$scope.submitRMOrderInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveRMOrder();
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
	
	$scope.getRMListByVendor = function(){
		$scope.rmMsg = false;
		/*utils.showProgressBar();*/
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterial/getRMaterial/" + $scope.rmOrder.vendor.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.vendorRmList = response.data;
			console.log(response);
		/*	utils.hideProgressBar();*/
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();
		})
	};
	
	$scope.calculateTotalPrice=function(){
		console.log($scope.orderRawMaterials);
		$scope.productSubTotal = 0;
		for (var i = 0; i < $scope.orderRawMaterials.length; i++){
		   $scope.productSubTotal += $scope.orderRawMaterials[i].rawmaterial.pricePerUnit * $scope.orderRawMaterials[i].quantity;
		}
		console.log('Product Sub Total : '+$scope.productSubTotal);
		$scope.rmOrder.actualPrice = $scope.productSubTotal;
		$scope.rmOrder.tax = $scope.productSubTotal * TAX;
		console.log('Tax Sub Total : '+$scope.rmOrder.tax);
		$scope.rmOrder.totalprice = $scope.rmOrder.actualPrice + $scope.rmOrder.tax + $scope.rmOrder.otherCharges;
		console.log('Total Price : '+ $scope.rmOrder.totalprice);
	};
	
	$scope.updateOtherCharges=function(){
		console.log('in update other charges');
		console.log('Other Charges : '+$scope.rmOrder.otherCharges);
		$scope.rmOrder.totalprice = $scope.rmOrder.actualPrice + $scope.rmOrder.tax + $scope.rmOrder.otherCharges;
		console.log('Total Price : '+$scope.rmOrder.totalprice);
	};
	
	$scope.updateQuantity = function(quantity){
		if(quantity < 0){
			console.log("its if block");
			$scope.RMOrderInformation.quantity.$setValidity("quantityUpdateMessage" , false);
		}else{
			$scope.RMOrderInformation.quantity.$setValidity("quantityUpdateMessage" , true);
			console.log("its else block");
			$scope.calculateTotalPrice();
		}
	};
	
	$scope.displayVendorId=function(){
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
	
	    $scope.addOrderRawMaterial = function(){
	    	console.log('Adding RM : ', $scope.orderRawMaterial);
	    	if( !angular.equals($scope.orderRawMaterial,{}) ){
	    		if(!$scope.isDuplicateRM($scope.orderRawMaterial)){
				   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
				   console.log(" $scope.orderRawMaterials : " , $scope.orderRawMaterials);
				   $scope.RMOrderInformation.rawmaterial.$setValidity("message", true);
				   $scope.orderRawMaterial={};
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
	    
	    $scope.deleteRM=function(index) {
	    	console.log('in delete RM'+ $scope.orderRawMaterials)
	    	var lastItem = $scope.orderRawMaterials.length;
		    $scope.orderRawMaterials.splice(index,1);
		    $scope.calculateTotalPrice();
	    }
	    
	    $scope.getRmForOrder=function(){
	    	if($scope.rmOrder.id){
		    	var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "rawmaterialorderassociation/getRMForRMOrder/"+ $scope.rmOrder.id;
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
				};
				$http(httpparams).then(function successCallback(response) {
					$scope.orderRawMaterials = response.data;
					console.log(response);
		            console.log($scope.orderRawMaterials);
				}, function errorCallback(response) {
					console.log("Error");
				});
	    	}
	    };
});