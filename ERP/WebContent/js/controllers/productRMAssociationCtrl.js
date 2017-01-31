erpApp
		.controller(
				'productRMAssociationCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL) {
					$scope.isReadOnly = false;
					
					$rootScope.$on("CallPopulateProductRMAssociationList", function() {
						$scope.populateProductRMAssociationList();
					});
					$rootScope.$on("saveproductRMAssociationError", function() {
						$scope.showAddNewProductRMAssociation();
					});

					$scope.populateProductRMAssociationList = function() {
						$http({
							method : 'GET',
							url : SERVER_URL + "productRMAsso/list"
						}).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.productRMAssociations = response.data;

							console.log(response);

						}, function errorCallback(response) {
							$scope.message = "We are Sorry. Something went wrong. Please try again later."
							$scope.showToast();
							console.log("Error");

						});
					}
					
					$scope.isProductRmAssociationPresent=false;
					$scope.isProductRMAssociationInfo=function()
					{
						if($scope.data.length==0)
							{
							$scope.isProductRmAssociationPresent=true;
							}
						else
							{
							$scope.isProductRmAssociationPresent=false;
							}
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
					
					$scope.productRMAssociation = {};
					$scope.showAddNewProductRMAssociation = function(ev) {
						$scope.productRMAssociation = {};
						$scope.information="ADD NEW productRMAssociation"
						$scope.flag = 0;
						$scope.isReadOnly = false;
						var abc = {
							controller : DialogController,
							templateUrl : 'views/productRMAssociationInformation.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing productRMAssociation dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								productRMAssociation : $scope.productRMAssociation,
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
					
					
					
					
					
					
					
					
					

					function DialogController($scope, $mdDialog, productRMAssociation,
							$location, $rootScope,SERVER_URL,flag,action,information) {
						$scope.isReadOnly = action;
						$scope.flag = flag;
						$scope.productRMAssociation = productRMAssociation;
						$scope.information = information;
						
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
						
						$scope.getRawMaterials = function(){
							$http({
								method : 'GET',
								url : SERVER_URL + "rawmaterial/list"
							}).then(function successCallback(response) {
								$scope.data = response.data;
								$scope.rawMaterials = response.data;

								console.log(response);

							}, function errorCallback(response) {
								$scope.message = "We are Sorry. Something went wrong. Please try again later."
								$scope.showToast();
								console.log("Error");

							});
							
							
						};
						
						$scope.getProducts = function(){
							$http({
								method : 'GET',
								url : SERVER_URL + "product/list"
							}).then(function successCallback(response) {
								$scope.data = response.data;
								$scope.products = response.data;

								console.log(response);

							}, function errorCallback(response) {
								$scope.message = "We are Sorry. Something went wrong. Please try again later."
								$scope.showToast();
								console.log("Error");

							});
							
							
						};

						$scope.saveproductRMAssociation = function(ev) {
							
							
							var data = {
									rawmaterial: $scope.productRMAssociation.rawmaterial.id,
									product: $scope.productRMAssociation.product.id,
									quantity: $scope.productRMAssociation.quantity,
									isActive : true
							};
							var httpparams = {};
							if ($scope.flag == 0) {
								console.log($scope.productRMAssociation);
								console.log($scope.data);
								httpparams.method = 'post';
								httpparams.url = SERVER_URL + "productRMAsso/create";
							} else {
								console.log($scope.productRMAssociation);
								data.id = $scope.productRMAssociation.id;
								httpparams.method = 'put';
								httpparams.url = SERVER_URL + "productRMAsso/update";
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
															"saveproductRMAssociationError", {});
													console.log(data);
													$scope.hide();
													$scope.message = 'Something went worng. Please try again later.';
													$scope.showToast();
												}else{
													$scope.displayProgressBar = false;
													$scope.message = 'Product RM Association Information saved successfully.';
													$scope.showToast();
													$rootScope.$emit("CallPopulateProductRMAssociationList",{});
												}
											},
											function errorCallback(data) {
												$rootScope.$emit(
														"saveproductRMAssociationError", {});
												console.log(data);
												$scope.hide();
												$scope.message = 'Something went worng. Please try again later.';
												$scope.showToast();
											});

						};

						$scope.submitInformation = function(isvalidproductRMAssociation,$event) {
							if (isvalidproductRMAssociation) {
								$scope.showProgressBar($event);
								
							} else {
								console.log('its else block');
							}

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
													$scope.saveproductRMAssociation(ev);
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
						
					};

					$scope.deleteproductRMAssociation = function(index) {
						 $scope.productRMAssociation = $scope.productRMAssociations[index].id; 
						console.log($scope.productRMAssociation);

						$http(
								{
									method : 'delete',
									url : SERVER_URL + "productRMAssociation/delete/"
											+ $scope.productRMAssociations[index].id

								}).then(function successCallback(data) {
							$rootScope.$emit("CallPopulateProductRMAssociationList", {});
							console.log(data);

						}, function errorCallback(data) {
							console.log("Error");

						});

					};

					$scope.showEditproductRMAssociation = function(ev, index) {
						$scope.information ="EDIT Product RM Association INFORMATION"
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.productRMAssociation = $scope.productRMAssociations[index];
						console.log($scope.productRMAssociation);
						$mdDialog
								.show({
									controller : DialogController,
									templateUrl : 'views/productRMAssociationInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										productRMAssociation : $scope.productRMAssociation,
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

					$scope.viewproductRMAssociationInformation = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.productRMAssociation = $scope.productRMAssociations[index];
						$scope.isSaving = false;
						$scope.information ="VIEW Product RM Association INFORMATION"
						console.log($scope.productRMAssociation);
						$mdDialog.show({
									controller : DialogController,
									templateUrl : 'views/productRMAssociationInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										productRMAssociation : $scope.productRMAssociation,
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
								'Are you sure you want to Delete Product RMAssociation Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');

						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteproductRMAssociation(index);
											
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