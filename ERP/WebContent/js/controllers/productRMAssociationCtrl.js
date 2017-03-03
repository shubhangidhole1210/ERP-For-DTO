erpApp.controller('productRMAssociationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth) {
	
	$rootScope.$on("callPopulateProductRmAssociationList", function() {
		$scope.populateProductRmAssoList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductRMAssociation()
	});
	
	
	$scope.populateProductRmAssoList=function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productRMAsso/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				/*$scope.isVendorInformation();*/
				$scope.productRmAssociations = response.data;
				$mdDialog.hide();
				console.log(response);

			}, function errorCallback(response) {
				$scope.showToast();
				$scope.message = "We are Sorry. Something went wrong. Please try again later."
				console.log("Error");
				$mdDialog.hide();

			});
		 $scope.showProgressBarOne();
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
	 
	/*$scope.isVendorPredent =false;
	$scope.isVendorInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isVendorPredent =true;
			}
		else
			{
			$scope.isVendorPredent =false;
			}
			
	}*/
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
	
	$scope.productRmAsso={};
	
	$scope.showAddNewProductRMAssociation = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW PRODUCT RM ASSOCIATION";
		$scope.productRmAsso={};
		var abc = {
			controller : DialogController,
			templateUrl : 'views/productRMAssociationInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				productRmAsso : $scope.productRmAsso,
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
	  function DialogController($scope, $mdDialog,productRmAsso,flag,action,$rootScope,$mdToast,information) {
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
		    
		    $scope.saveProductRMAssociationInfo=function(ev)
		    {
		    	/* console.log($scope.data)*/
		    	 var data = {
		    		rawmaterial : $scope.productRmAsso.rawmaterial.id,
		    		product : $scope.productRmAsso.product.id,
		    		quantity : $scope.productRmAsso.quantity,
		    		"createdBy": 33,
		    		"created_date":  null,
		    		"updatedBy":44,
		    		"updated_date": null,
		    		"isactive":true
		    			 
					};
		    	 
		    	
		    	 var httpparams = {};
		    	 if($scope.flag==0)
		    		 {
		    		    httpparams.method='post',
		    		    httpparams.url=SERVER_URL + "productRMAsso/create"
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
								}
								/*else if(data.data.code===1)
									{
									 console.log(data.data.message);
									 $rootScope.$emit(
											"saveVendorError", {});
									 console.log(data);
									 $scope.hide();
									 $scope.message = 'Company Name or Email alredy Exist.';
									 $scope.showToast();
									}*/
								
								else{
									$scope.displayProgressBar = false;
									$scope.message = 'Product RM Association Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("callPopulateProductRmAssociationList",{});
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
										$scope.saveProductRMAssociationInfo(ev);
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
			
			$scope.rawMaterialId=function()
			{
				
				var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "rawmaterial/list";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
				
				/*$http({
					method : 'GET',
					url : SERVER_URL + "rawmaterial/list"
				})*/
				$http(httpparams).then(function successCallback(response) {
					$scope.RMData = response.data;

					console.log(response);

				}, function errorCallback(response) {
					console.log("Error");

				})
				
			};
			 $scope.getProducts=function()
			    {
			    	/*$http({
						method : 'GET',
						url : SERVER_URL + "product/list"
					})*/
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
		    
		  }
	  
	  
	  $scope.showEditproductRMAssociation = function(ev , index) {
		  $scope.flag = 1;
		  $scope.isReadOnly = false;
		  $scope.productRmAsso = $scope.productRmAssociations[index];
		  $scope.information="EDIT PRODUCT RM ASSOCIATION"
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: 'views/productRMAssociationInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  productRmAsso : $scope.productRmAsso,
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
	  
	  $scope.deleteProductRMAssociation = function(index) {
			/* $scope.user = $scope.users[index].id; */
			console.log($scope.vendoUser);

			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "productRMAsso/delete/" + $scope.productRmAssociations[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
						$mdDialog.hide();
						$rootScope.$emit("callPopulateProductRmAssociationList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			$scope.showProgressBarOne();
		};
		
		$scope.viewproductRMAssociationInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			 $scope.productRmAsso = $scope.productRmAssociations[index];
			$scope.isSaving = false;
			$scope.information="VIEW PRODUCT RM ASSOCIATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : DialogController,
						templateUrl : 'views/productRMAssociationInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							productRmAsso : $scope.productRmAsso,
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
					'Are you sure you want to Delete Vendor Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'Delete' ).cancel('Cancel');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteProductRMAssociation(index);
								
								$scope.message = 'Delete Product RM Asssociation  Record sucessfully';
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
















