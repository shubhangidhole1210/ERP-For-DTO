erpApp
		.controller(
				'RMVendorCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils) {
					$scope.isReadOnly = false;
					$scope.isPresentvenodrAsso=false;

					$rootScope.$on("CallPopulateRMVendorAssociationList", function() {
						$scope.populateRMVendorAssociationList();
					});
					$rootScope.$on("saveRMOrderAssociationError", function() {
						$scope.showAddNewRMVendorAssociation();
					});

					$scope.populateRMVendorAssociationList = function() {
					
						utils.showProgressBar();
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL + "rmvendorasso/list";
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						
						$http(httpparams).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.rmOrderAssociations = response.data;
							$scope.isRMVendorAssociationInformation();
							console.log(response);
							utils.hideProgressBar();

						}, function errorCallback(response) {
							$scope.message = "We are Sorry. Something went wrong. Please try again later."
							$scope.showToast();
							console.log("Error");
							utils.hideProgressBar();
						});
						
					}
					
					
					
					/*$scope.isPresentvenodrAsso=false;
					$scope.isRMVendorAssociationInformation=function()
					{
						if($scope.data.length==0)
							{
							$scope.isPresentvenodrAsso=true;
							}
						else{
							$scope.isPresentvenodrAsso=false;
						}
						
					}*/
					
					$scope.isRMVendorAssociationInformation = function() {
						$scope.isPresentvenodrAsso = $scope.data.length === 0 ? true : false;
					};
					
					$scope.rmOrderAssociation = {};
					$scope.showAddNewRMVendorAssociation = function(ev) {
						$scope.flag = 0;
						$scope.isReadOnly = false;
						$scope.rmOrderAssociation = {};
						$scope.title="ADD RAW MATERIAL VENDOR ASSOCIATION INFORMATION"
						var addNewRMVendorAsso = {
							controller : 'RMVendorAssociationDialogCtrl',
							templateUrl : 'views/RMVendorInfo.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing user dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								rmOrderAssociation : $scope.rmOrderAssociation,
								flag : $scope.flag,
								action : $scope.isReadOnly,
								title: $scope.title
							}
						};
						$mdDialog
						.show(addNewRMVendorAsso)
						.then(function(answer) {},
								function() {});
					};
					
					
					
					
					
					
					
					
					
/*
					function RMVendorAssociationController($scope, $mdDialog, rmOrderAssociation,
							$location, $rootScope,SERVER_URL,flag,action,title) {
						$scope.isReadOnly = action;
						$scope.flag = flag;
						$scope.rmOrderAssociation = rmOrderAssociation;
						$scope.title = title;
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

						$scope.saveRMOrderAssociation = function(ev) {
							
							
							var data = {

									rawmaterial:$scope.rmOrderAssociation.rawmaterial.id,
									vendor:$scope.rmOrderAssociation.vendor.id,
									pricePerUnit:$scope.rmOrderAssociation.pricePerUnit,
									created_date:  null,
									updatedBy:3,
									updated_date: null,
									isactive:true
							};
							var httpparams = {};
							if ($scope.flag == 0) {
								console.log($scope.rmOrderAssociation);
								console.log($scope.data);
								httpparams.method = 'post';
								httpparams.url = SERVER_URL + "rmvendorasso/create";
								httpparams.headers = {
										auth_token : Auth.getAuthToken()
									};
							} else {
								console.log($scope.rmOrderAssociation);
								data.id = $scope.rmOrderAssociation.id;
								httpparams.method = 'put';
								httpparams.url = SERVER_URL + "rmvendorasso/update";
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
															"saveRMOrderAssociationError", {});
													console.log(data);
													$scope.hide();
													$scope.message = 'Something went worng. Please try again later.';
													$scope.showToast();
												}else{
													$scope.displayProgressBar = false;
													$scope.message = ' Raw Material Vendor Association Information saved successfully.';
													$scope.showToast();
													$rootScope.$emit("CallPopulateRMVendorAssociationList",{});
												}
											},
											function errorCallback(data) {
												$rootScope.$emit(
														"saveRMOrderAssociationError", {});
												console.log(data);
												$scope.hide();
												$scope.message = 'Something went worng. Please try again later.';
												$scope.showToast();
											});

						}

						$scope.submitRMVendorAssociationInformation = function(isvaliduser,$event) {
							if (isvaliduser) {
								$scope.showProgressBar($event);
								
							} else {
								console.log('its else block');
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
													$scope.saveRMOrderAssociation(ev);
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
						
						    $scope.getRawMaterials=function()
						    {
						    	$http({
									method : 'GET',
									url : SERVER_URL + "rawmaterial/list"
								})
						    	
						    	var httpparams = {};
								httpparams.method = 'GET';
								httpparams.url = SERVER_URL + "rawmaterial/list";
								httpparams.headers = {
										auth_token : Auth.getAuthToken()
									};
								
								$http(httpparams).then(function successCallback(response) {
									$scope.rawmaterials = response.data;
							

									console.log(response);

								}, function errorCallback(response) {
									console.log("Error");

								});
						    }
						
							
						   $scope.getVendors=function()
						   {
							   var httpparams = {};
								httpparams.method = 'GET';
								httpparams.url = SERVER_URL + "vendor/list";
								httpparams.headers = {
										auth_token : Auth.getAuthToken()
									};
								
								$http(httpparams).then(function successCallback(response) {
									$scope.venodrs = response.data;
							

									console.log(response);

								}, function errorCallback(response) {
									console.log("Error");

								});
						   }
						
						
							
						
						
						

					};
*/
					$scope.deleteUser = function(index) {
						console.log($scope.user);

						$http(
								{
									method : 'delete',
									url : SERVER_URL + "rmvendorasso/delete/"
											+ $scope.rmOrderAssociations[index].id

								}).then(function successCallback(data) {
							$rootScope.$emit("CallPopulateRMVendorAssociationList", {});
							console.log(data);

						}, function errorCallback(data) {
							console.log("Error");

						});
						$scope.showProgressBarOne()
					};

					$scope.showRMVendorAssociation = function(ev, index) {
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.rmOrderAssociation = $scope.rmOrderAssociations[index];
						console.log($scope.rmOrderAssociation);
						$scope.title= "EDIT RAW MATERIAL VENDOR ASSOCIATION INFORMATION"
						$mdDialog
								.show({
									controller : 'RMVendorAssociationDialogCtrl',
									templateUrl : 'views/RMVendorInfo.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmOrderAssociation : $scope.rmOrderAssociation,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										title : $scope.title
									}
								})
								.then(function(answer) {},
										function() {});
					};

					$scope.viewRMVendorAssociation = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.rmOrderAssociation = $scope.rmOrderAssociations[index];
						$scope.isSaving = false;
						$scope.title= "VIEW RAW MATERIAL VENDOR ASSOCIATION INFORMATION"
					
						$mdDialog.show({
									controller : 'RMVendorAssociationDialogCtrl',
									templateUrl : 'views/RMVendorInfo.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmOrderAssociation : $scope.rmOrderAssociation,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										title : $scope.title
									}
								})
								.then(function(answer) {},
										function() {});
					};

					$scope.deleteRMVendorAssociation = function(index) {
					
						var httpparams = {};
						httpparams.method = 'delete';
						httpparams.url = SERVER_URL + "unit/delete/" + $scope.rmOrderAssociations[index].id;
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(data) {
							utils.hideProgressBar();
							$rootScope.$emit("CallPopulateRMVendorAssociationList", {});
							console.log(data);

						}, function errorCallback(data) {
							console.log("Error");

						});
						utils.showProgressBar();

					};
					$scope.showConfirm = function(ev,index) {
						var confirm = $mdDialog.confirm().title(
								'Are you sure you want to Delete Raw Material Vendor Association Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');

						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteRMVendorAssociation(index);
											utils.showToast('Rm Vendor Association Deleted Sucessfully!');
										
										},
										function() {
											$scope.status = 'You decided to keep your debt.';
										});
					};

					

				});