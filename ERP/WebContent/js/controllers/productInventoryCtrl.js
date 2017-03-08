erpApp.controller('productInventoryCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	
	$rootScope.$on("callPopulateProductInventoryList", function() {
		$scope.populateProductInventoryList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductInventory()
	});
	
	
	$scope.populateProductInventoryList=function()
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productinventory/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.productInventorys = response.data;
				$scope.isProductInventoryinformation();
				console.log(response);
				utils.hideProgressBar();
			}, function errorCallback(response) {
				$scope.showToast();
				console.log("Error");
				utils.hideProgressBar();
			});
	}
	
	
	$scope.isProductInventoryPresent=false;
	$scope.isProductInventoryinformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isProductInventoryPresent=true;
			}
		else{
			$scope.isProductInventoryPresent=false;
		}
	}
	
	
	
	
	 
	$scope.productInventory={};
	
	$scope.showAddNewProductInventory = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW PRODUCT INVENTORY";
		$scope.productInventory={};
		var addNewProductInventoryDialog = {
			controller : 'productInventoryDialogController',
			templateUrl : 'views/productInventoryInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				productInventory : $scope.productInventory,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewProductInventoryDialog)
		.then(function(answer) {},
				function() {});
	  };
	/*  function DialogVendorController($scope, $mdDialog,productInventory,flag,action,$rootScope,$mdToast,information,Auth) {
		    $scope.productInventory=productInventory;
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
		    
		    $scope.saveProductInventory=function(ev)
		    {
		    	 console.log($scope.data)
		    	 var data = {

		    			 product:$scope.productInventory.product.id,
		    			 description:$scope.productInventory.description,
		    			 name:$scope.productInventory.name,
		    			 quantityavailable:$scope.productInventory.quantityavailable,
		    			 racknumber:$scope.productInventory.racknumber,
		    			 createdBy:2,
		    			 created_date:null,
		    			 updatedBy:1,
		    			 updated_date:null,
		    			 isactive:true
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
		    	 
		    	 else
		    		 {
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
									$scope.displayProgressBar = false;
									$scope.message = 'User Information saved successfully.';
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
		    	 
		    }
		    
		    
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
					$scope.showProgressBar($event);
					
				} else {
					console.log('its else block');
				}

			}
		    
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
									
								// Only for -xs, -sm breakpoints.
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
			
			
			$scope.getProduct=function()
			{
				
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
			
			
			
		    
		  }*/
	  
	  
	  $scope.showEditProductInventory = function(ev , index) {
		  $scope.flag = 1;
		  $scope.productInventory = $scope.productInventorys[index];
		  $scope.information="EDIT PRODUCT INVENTORY INFORMATION"
		    $mdDialog.show({
		      controller: 'productInventoryDialogController',
		      templateUrl: 'views/productInventoryInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  productInventory : $scope.productInventory,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteProductInventory = function(index) {
		
			console.log($scope.vendoUser);

			
			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "productinventory/delete/"  + $scope.productInventorys[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
						$mdDialog.hide();
						$rootScope.$emit("callPopulateProductInventoryList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			$scope.showProgressBarOne();

		};
		
		$scope.viewProductInventoryInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.productInventory = $scope.productInventorys[index];
			$scope.isSaving = false;
			$scope.information="VIEW PRODUCT INVENTORY INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'productInventoryDialogController',
						templateUrl : 'views/productInventoryInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							  productInventory : $scope.productInventory,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information
						}
					})
					.then(function(answer) {},
							function() {});
		};
		$scope.showConfirm = function(ev,index) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete Product Inventory Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'YES' ).cancel('NO');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteProductInventory(index);
								
								$scope.message = 'Delete Record sucessfully';
								$scope.showToast();
								
							},
							function() {
								$scope.status = 'You decided to keep your debt.';
							});
		};
		
		function ProgressBarController($scope, $mdDialog) {
			
			$scope.hide = function() {
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
		}
	
});
















