erpApp.controller('productInventoryCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast) {
	
	$rootScope.$on("callPopulateProductInventoryList", function() {
		$scope.populateProductInventoryList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductInventory()
	});
	
	
	$scope.populateProductInventoryList=function()
	{
		
		 $http({
				method : 'GET',
				url : SERVER_URL + "productinventory/list"
			}).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.productInventorys = response.data;
				$scope.isProductInventoryinformation();
				console.log(response);
				$mdDialog.hide();
			}, function errorCallback(response) {
				$scope.showToast();
				console.log("Error");
				$mdDialog.hide();
			});
		 $scope.showProgressBarOne();
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
	
	$scope.showProgressBarOne= function()
	{
		$mdDialog
		.show(
				{
					controller : ProgressBarController,
					templateUrl : 'views/progressBar.html',
					parent : angular
							.element(document.body),
					/*targetEvent : ev,*/
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					onComplete : function() {
					/*	$scope.populateUserList(ev);*/
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
	 
	 
	$scope.productInventory={};
	
	$scope.showAddNewProductInventory = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW PRODUCT INVENTORY";
		$scope.productInventory={};
		var abc = {
			controller : DialogVendorController,
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
				.show(abc)
				.then(
						function(answer) {
							$scope.status = 'You said the information was "'
									+ answer + '".';
						},
						function() {
							$scope.status = 'You cancelled the dialog.';
						});
	  };
	  function DialogVendorController($scope, $mdDialog,productInventory,flag,action,$rootScope,$mdToast,information) {
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
		    	/* console.log($scope.data)*/
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
		    		 }
		    	 else
		    		 {
		    		      data.id=$scope.productInventory.id,
		    		      httpparams.method='put',
		    		      httpparams.url=SERVER_URL + "productinventory/update"
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
									/*$scope.displayProgressBar = false;*/
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
				$http({
					method : 'GET',
					url : SERVER_URL + "product/list"
				}).then(function successCallback(response) {
					$scope.prducts = response.data;

					console.log(response);

				}, function errorCallback(response) {
					console.log("Error");

				})
			};
			
			
			
		    
		  }
	  
	  
	  $scope.showEditProductInventory = function(ev , index) {
		  $scope.flag = 1;
		  $scope.productInventory = $scope.productInventorys[index];
		  $scope.information="EDIT PRODUCT INVENTORY INFORMATION"
		    $mdDialog.show({
		      controller: DialogVendorController,
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
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
		  };
	  
	  $scope.deleteProductInventory = function(index) {
			/* $scope.user = $scope.users[index].id; */
			console.log($scope.vendoUser);

			$http(
					{
						method : 'delete',
						url : SERVER_URL + "productinventory/delete/"
								+ $scope.productInventorys[index].id

					}).then(function successCallback(data) {
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
						controller : DialogVendorController,
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
					.then(
							function(answer) {
								$scope.status = 'You said the information was "'
										+ answer + '".';
							},
							function() {
								$scope.status = 'You cancelled the dialog.';
							});
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
















