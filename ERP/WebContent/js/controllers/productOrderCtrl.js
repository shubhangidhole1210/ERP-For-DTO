erpApp.controller('productOrderCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast) {
	
	$scope.isProductOrderPresent=false;
	$scope.productOrder={};
	
	$rootScope.$on("callPopulateProductOrderList", function() {
		$scope.populateProductOrderList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductOrder()
	});
	
	$scope.populateProductOrderList = function() {
			$http({	method : 'GET',	url : SERVER_URL + "productorder/list"})
					.then( function successCallback(response) {
								$scope.data = response.data;
								$scope.productOrders = response.data;
								console.log(response);
								$scope.isProductOrderInformation();
								$mdDialog.hide();
							},
							function errorCallback(response) {
								$scope.showToast();
								console.log("Error");
								$scope.message = "We are Sorry. Something went wrong. Please try again later."
								$mdDialog.hide();
			});
			$scope.showProgressBarOne();
	};
	
	$scope.isProductOrderInformation=function()	{
		if($scope.data.length==0)
			$scope.isProductOrderPresent=true;
		else
			$scope.isProductOrderPresent=false;
	};
	
	$scope.showProgressBarOne= function(){
		$mdDialog.show({
					controller : ProgressBarController,
					templateUrl : 'views/progressBar.html',
					parent : angular.element(document.body),
					/*targetEvent : ev,*/
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					onComplete : function() {
					/*	$scope.populateUserList(ev);*/
					}
			}).then(function(answer) {
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
	 
	 
	$scope.showAddNewProductOrder = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW PRODUCT ORDER";
		$scope.productOrder={};
		var abc = {
			controller : DialogVendorController,
			templateUrl : 'views/productOrderInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				productOrder : $scope.productOrder,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog.show(abc).then(function() {},	function() {});
	  };
	  
	  function DialogVendorController($scope, $mdDialog,productOrder,flag,action,$rootScope,$mdToast,information) {
		    $scope.productOrder=productOrder;
		    $scope.flag=flag;
		    $scope.isReadOnly = action;
		    $scope.information = information;
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
		    			/* product: $scope.productOrder.product.id,*/
		    			 description:$scope.productOrder.description,
		    			 status:$scope.productOrder.status.id,
		    			 quantity:$scope.productOrder.quantity ,
		    			 expecteddeliveryDate:$scope.productOrder.expecteddeliveryDate ,
		    			  client:$scope.productOrder.client.id,
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
		    		    httpparams.url=SERVER_URL + "productorder/create"
		    		 }
		    	 else
		    		 {
		    		      data.id=$scope.productOrder.id,
		    		      httpparams.method='put',
		    		      httpparams.url=SERVER_URL + "productorder/update"
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
									$rootScope.$emit("callPopulateProductOrderList",{});
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
										$scope.saveProductOrder(ev);
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
			
			 $scope.getProducts=function()
			    {
			    	$http({
						method : 'GET',
						url : SERVER_URL + "product/list"
					}).then(function successCallback(response) {
						$scope.products = response.data;
				

						console.log(response);

					}, function errorCallback(response) {
						console.log("Error");

					});
			    };
			 $scope.getStatus=function()
			    {
				 $http({
						method : 'GET',
						url : SERVER_URL + "status/list"
					}).then(function successCallback(response) {
						$scope.statusData = response.data;

						console.log(response);

					}, function errorCallback(response) {
						console.log("Error");

					});
			    };
			    
			    $scope.getClient=function(){
				 $http({
						method : 'GET',
						url : SERVER_URL + "client/list"
					}).then(function successCallback(response) {
						$scope.clients = response.data;

						console.log(response);

					}, function errorCallback(response) {
						console.log("Error");

					});
			    };
			    
		    
			    
			    $scope.orderProductAssociations=[];
			    $scope.orderProductAssociation={};
			    $scope.addOrderProductAssociation=function(){
			    	if(!angular.equals($scope.orderProductAssociation,{})){
						   $scope.orderProductAssociations.push($scope.orderProductAssociation);	
						   $scope.orderProductAssociation = {};
						   console.log($scope.orderProductAssociations);
					}
			    };
		  };
	  
	  
	  $scope.showEditProductOrder = function(ev , index) {
		  $scope.flag = 1;
		  $scope.productOrder = $scope.productOrders[index];
		  $scope.information="EDIT PRODUCT ORDER INFORMATION"
		    $mdDialog.show({
		      controller: DialogVendorController,
		      templateUrl: 'views/productOrderInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  productOrder : $scope.productOrder,
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
	  
	  $scope.deleteProductOrder = function(index) {
			/* $scope.user = $scope.users[index].id; */
			console.log($scope.vendoUser);

			$http(
					{
						method : 'delete',
						url : SERVER_URL + "productorder/delete/"
								+ $scope.productOrders[index].id

					}).then(function successCallback(data) {
						$mdDialog.hide();
						$rootScope.$emit("callPopulateProductOrderList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			 $scope.showProgressBarOne();
		};
		
		$scope.viewProductOrderrInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.productOrder = $scope.productOrders[index];
			$scope.isSaving = false;
			$scope.information="VIEW VENDOR INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : DialogVendorController,
						templateUrl : 'views/productOrderInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							  productOrder : $scope.productOrder,
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
					'Are you sure you want to Delete Product Order Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'YES' ).cancel('NO');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteProductOrder(index);
								
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
















