erpApp
		.controller(
				'RMInventaryCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL) {
					$scope.isReadOnly = false;
					

					$rootScope.$on("CallPopulateRMInventaryList", function() {
						$scope.populateRMInventaryList();
					});
					$rootScope.$on("saveRMInventaryError", function() {
						$scope.showAddNewRMInventary();
					});

					$scope.populateRMInventaryList = function() {
						$http({
							method : 'GET',
							url : SERVER_URL + "rawmaterialinventory/list"
						}).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.rmInventarys = response.data;

							console.log(response);

						}, function errorCallback(response) {
							$scope.message = "We are Sorry. Something went wrong. Please try again later."
							$scope.showToast();
							console.log("Error");

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
					
					$scope.rmInventary = {};
					$scope.showAddNewRMInventary = function(ev) {
						$scope.flag = 0;
						$scope.isReadOnly = false;
						$scope.rmInventary = {};
						$scope.information = "ADD NEW RAW MATERIAL INVENTORY INFORMATION"
						var abc = {
							controller : RMInvenaryDialogeController,
							templateUrl : 'views/RMInventaryInformation.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing user dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								rmInventary : $scope.rmInventary,
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
					
					
					
					
					
					
					
					
					

					function RMInvenaryDialogeController($scope, $mdDialog, rmInventary,
							$location, $rootScope,SERVER_URL,flag,action,information) {
						$scope.isReadOnly = action;
						$scope.flag = flag;
						$scope.rmInventary = rmInventary;
						$scope.information = information
						
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

						$scope.saveRMInventaryInformation = function(ev) {
							
							
							var data = {

									/*"rawmaterial":8,*/
									rawmaterial:$scope.rmInventary.rawmaterial.id,
									quantityAvailable:$scope.rmInventary.quantityAvailable,
									name:$scope.rmInventary.name,
									description:$scope.rmInventary.description,
									createdBy:1,
									created_date:  null,
									updatedBy:3,
									updated_date: null,
									isactive:true
							};
							var httpparams = {};
							if ($scope.flag == 0) {
								console.log($scope.rmInventary);
								console.log($scope.data);
								httpparams.method = 'post';
								httpparams.url = SERVER_URL + "rawmaterialinventory/create";
							} else {
								console.log($scope.rmInventary);
								data.id = $scope.rmInventary.id;
								httpparams.method = 'put';
								httpparams.url = SERVER_URL + "rawmaterialinventory/update";
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
															"saveRMInventaryError", {});
													console.log(data);
													$scope.hide();
													$scope.message = 'Something went worng. Please try again later.';
													$scope.showToast();
												}else{
													$scope.displayProgressBar = false;
													$scope.message = 'User Information saved successfully.';
													$scope.showToast();
													$rootScope.$emit("CallPopulateRMInventaryList",{});
												}
											},
											function errorCallback(data) {
												$rootScope.$emit(
														"saveRMInventaryError", {});
												console.log(data);
												$scope.hide();
												$scope.message = 'Something went worng. Please try again later.';
												$scope.showToast();
											});

						}

						$scope.submitRMInventaryInformation = function(isvaliduser,$event) {
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
													$scope.saveRMInventaryInformation(ev);
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
						
						$http({
							method : 'GET',
							url : SERVER_URL + "rawmaterial/list"
						}).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.users = response.data;

							console.log(response);

						}, function errorCallback(response) {
							console.log("Error");

						});
						
						

					};

					$scope.deleteRMInventory = function(index) {
						/* $scope.user = $scope.users[index].id; */
						console.log($scope.rmInventary);

						$http(
								{
									method : 'delete',
									url : SERVER_URL + "rawmaterialinventory/delete/"
											+ $scope.rmInventarys[index].id

								}).then(function successCallback(data) {
							$rootScope.$emit("CallPopulateRMInventaryList", {});
							console.log(data);

						}, function errorCallback(data) {
							console.log("Error");

						});

					};
					$scope.showConfirm = function(ev,index) {
						// Appending dialog to document.body to cover sidenav in docs app
						var confirm = $mdDialog.confirm().title(
								'Are you sure you want to Delete Raw Material Inventory Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');

						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteRMInventory(index);
											
											$scope.message = 'Delete Record sucessfully';
											$scope.showToast();
											
											
										},
										function() {
											$scope.status = 'You decided to keep your debt.';
										});
					};


					$scope.showEditRMInventary = function(ev, index) {
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.rmInventary = $scope.rmInventarys[index];
						console.log($scope.rmInventary);
						$scope.information="EDIT NEW RAW MATERIAL INVENTORY INFORMATIONn"
						$mdDialog
								.show({
									controller : RMInvenaryDialogeController,
									templateUrl : 'views/RMInventaryInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmInventary : $scope.rmInventary,
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

					$scope.viewEditRMInventary = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.rmInventary = $scope.rmInventarys[index];
						$scope.isSaving = false;
						$scope.information="VIEW NEW RAW MATERIAL INVENTORY INFORMATION"
						console.log($scope.rmInventary);
						$mdDialog.show({
									controller : RMInvenaryDialogeController,
									templateUrl : 'views/RMInventaryInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmInventary : $scope.rmInventary,
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