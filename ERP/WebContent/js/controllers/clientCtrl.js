erpApp
		.controller(
				'clientCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL) {
					$scope.isReadOnly = false;
					

					$rootScope.$on("CallPopulateClientList", function() {
						$scope.populateClientList();
					});
					$rootScope.$on("saveClientError", function() {
						$scope.showAddNewClient();
					});

					$scope.populateClientList = function() {
						$http({
							method : 'GET',
							url : SERVER_URL + "client/list"
						}).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.clients = response.data;

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
					
					$scope.client = {};
					$scope.showAddNewClient = function(ev) {
						$scope.client = {};
						$scope.information="ADD NEW CLIENT"
						$scope.flag = 0;
						$scope.isReadOnly = false;
						var abc = {
							controller : ClientController,
							templateUrl : 'views/clientInformation.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing user dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								client : $scope.client,
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
					
					
					
					
					
					
					
					
					

					function ClientController($scope, $mdDialog, client,
							$location, $rootScope,SERVER_URL,flag,action,information) {
						$scope.isReadOnly = action;
						$scope.flag = flag;
						$scope.client = client;
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

						$scope.saveClient = function(ev) {
							
							
							var data = {

									companyname: $scope.client.companyname,
									description: $scope.client.description,
									address: $scope.client.address,
									emailid: $scope.client.emailid,
									contactnumber:$scope.client.contactnumber ,
									contactpersonname: $scope.client.contactpersonname,
									createdBy:2,
									created_date:null,
									updatedBy:1,
									updated_date:null,
									isactive:true
							};
							var httpparams = {};
							if ($scope.flag == 0) {
								console.log($scope.user);
								console.log($scope.data);
								httpparams.method = 'post';
								httpparams.url = SERVER_URL + "client/create";
							} else {
								console.log($scope.client);
								data.id = $scope.client.id;
								httpparams.method = 'put';
								httpparams.url = SERVER_URL + "client/update";
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
															"saveClientError", {});
													console.log(data);
													$scope.hide();
													$scope.message = 'Something went worng. Please try again later.';
													$scope.showToast();
												}else{
													$scope.displayProgressBar = false;
													$scope.message = 'User Information saved successfully.';
													$scope.showToast();
													$rootScope.$emit("CallPopulateClientList",{});
												}
											},
											function errorCallback(data) {
												$rootScope.$emit(
														"saveClientError", {});
												console.log(data);
												$scope.hide();
												$scope.message = 'Something went worng. Please try again later.';
												$scope.showToast();
											});

						}

						$scope.submitClientInformation = function(isvaliduser,$event) {
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
													$scope.saveClient(ev);
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
							url : SERVER_URL + "usertype/list"
						}).then(function successCallback(response) {
							$scope.data = response.data;
						/*	$scope.users = response.data;*/

							console.log(response);

						}, function errorCallback(response) {
							console.log("Error");

						});
						
						

					};

					$scope.deleteClient = function(index) {
						/* $scope.user = $scope.users[index].id; */
						console.log($scope.client);

						$http(
								{
									method : 'delete',
									url : SERVER_URL + "client/delete/"
											+ $scope.clients[index].id

								}).then(function successCallback(data) {
							$rootScope.$emit("CallPopulateClientList", {});
							console.log(data);

						}, function errorCallback(data) {
							console.log("Error");

						});

					};

					$scope.showEditClient = function(ev, index) {
						$scope.information ="EDIT CLIENT INFORMATION"
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.client = $scope.clients[index];
						console.log($scope.client);
						$mdDialog
								.show({
									controller : ClientController,
									templateUrl : 'views/clientInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										client : $scope.client,
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

					$scope.viewClientInformation = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.client = $scope.clients[index];
						$scope.isSaving = false;
						$scope.information ="VIEW CLIENT INFORMATION"
						console.log($scope.user);
						$mdDialog.show({
									controller : ClientController,
									templateUrl : 'views/clientInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										client : $scope.client,
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
								'Are you sure you want to Delete Client Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');

						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteClient(index);
											
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