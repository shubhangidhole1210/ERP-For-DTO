erpApp.controller('productInventoryDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,productInventory,flag,action,information,productAction){
	   $scope.productInventory=productInventory;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.isProductreadOnly = productAction;
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
	    
	    $scope.saveProductInventory=function(ev){
	    	 var data = {
	    			 productId:$scope.productInventory.product.id,
	    			 description:$scope.productInventory.description,
	    			 quantityAvailable:$scope.productInventory.quantityavailable,
	    			 racknumber:$scope.productInventory.racknumber,
	    			 minimumQuantity:$scope.productInventory.minimum_quantity,
	    			 maximumQuantity:$scope.productInventory.maximum_quantity
				};
	    	 var httpparams = {};
	    	 if($scope.flag==0)
	    		 {
	    		    httpparams.method='post',
	    		    httpparams.url=SERVER_URL + "productinventory/create"
	    		    httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
	    		 }
	    	 else{
	    		      data.id=$scope.productInventory.id,
	    		      httpparams.method='put',
	    		      httpparams.url=SERVER_URL + "productinventory/update"
	    		      httpparams.headers = {
	  						auth_token : Auth.getAuthToken()
	  					};
	    		 }
	    	 httpparams.data=data;
	    	 $http(httpparams)
	    	 .then(
						function successCallback(data) {
							$mdDialog.hide();
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							}else{
								$scope.message = 'Product Inventory Information saved successfully.';
								$scope.showToast();
								$rootScope.$emit("callPopulateProductInventoryList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveVendorError", {});
							console.log(data);
							$scope.hide();
							$scope.message = 'Something went worng. Please try again later.';
							$scope.showToast();
						});
	    };
	    
	    $scope.showToast = function() {
			$mdToast.show({
				hideDelay : 3000,
				position : 'top right',
				controller : 'ToastCtrl',
				templateUrl : 'views/toast.html',
				locals : {
					message : $scope.message
				}
			});
		};
		
		$scope.submitInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				 $scope.saveProductInventory($event);
			} else {
				console.log('its else block');
				utils.showToast('Please fill all required information');
			}
		};
	    
	    $scope.showProgressBar = function(ev) {
			$scope.displayProgressBar = true;
			$mdDialog
					.show(
							{
								controller : ProgressBarController,
								templateUrl : 'views/progressBar.html',
								parent : angular
										.element(document.body),
								targetEvent : ev,
								clickOutsideToClose : false,
								fullscreen : $scope.customFullscreen,
								onComplete : function() {
									$scope.saveProductInventory(ev);
								}
							})
					.then(
							function(answer) {
								$scope.status = 'You said the information was "'
										+ answer + '".';
							},
							function() {
								$scope.status = 'You cancelled the dialog.';
							});
		};
		
		$scope.getProduct=function(){
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "product/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(response) {
				$scope.prducts = response.data;
				console.log(response);
			}, function errorCallback(response) {
				console.log("Error");
			})
		};
});