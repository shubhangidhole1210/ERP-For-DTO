erpApp.controller(
				'userCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,utils) {
					$scope.isReadOnly = false;

					$rootScope.$on("CallPopulateUserList", function($event) {
						$scope.populateUserList();
						
					});
					$rootScope.$on("saveUserError", function() {
						$scope.showAddNewUser();
					});

					$scope.populateUserList = function() {
						utils.showProgressBar();
						$http({
							method : 'GET',
							url : SERVER_URL + "user/list"
						}).then(function successCallback(response) {
							
							$scope.data = response.data;
							$scope.users = response.data;
							$scope.isUserInformation();
							console.log(response);
							utils.hideProgressBar();
							/*$mdDialog.hide();*/

						}, function errorCallback(response) {
							$scope.message = "We are Sorry. Something went wrong. Please try again later."
							$scope.showToast();
							console.log("Error");
							$mdDialog.hide();
						
						});
							
						
						/*$scope.showProgressBarOne();*/
						/*progressBar.showProgressBarOne();*/
					} 
					
					$scope.isUserUnavailable=false;
					$scope.isUserInformation=function()
					{
						if($scope.data.length==0)
							{
							$scope.isUserUnavailable=true;
							}
						else
							{
							$scope.isUserUnavailable=false;
							}
					}
					/*
					$rootScope.$on("callProgressBar", function($event){
						$scope.showProgressBar();
					});
					*/
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
										/*$scope.populateUserList(ev);*/
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
					
					$scope.user = {};
					$scope.showAddNewUser = function(ev) {
						$scope.user = {};
						$scope.information="ADD NEW USER"
						$scope.flag = 0;
						$scope.isReadOnly = false;
						var abc = {
							controller : DialogController,
							templateUrl : 'views/userInformation.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing user dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								user : $scope.user,
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
					
					
					
					
					
					
					
					
					

					function DialogController($scope, $mdDialog, user,
							$location, $rootScope,SERVER_URL,flag,action,information) {
						$scope.isReadOnly = action;
						$scope.flag = flag;
						$scope.user = user;
						$scope.information = information;
						$scope.user.dob = new Date($scope.user.dob);
						$scope.user.doj = new Date($scope.user.doj);
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

						$scope.saveUser = function(ev) {
							
							
							var data = {

								userid : $scope.user.userid,
								password : $scope.user.password,
								firstName : $scope.user.firstName,
								lastName : $scope.user.lastName,
								mobile : $scope.user.mobile,
								email : $scope.user.email,
								usertype : $scope.user.usertype.id,
								doj : $scope.user.doj,
								dob : $scope.user.dob,
								created_by : null,
								created_date : null,
								updated_by : null,
								updated_date : null,
								isactive : true
							};
							var httpparams = {};
							if ($scope.flag == 0) {
								console.log($scope.user);
								console.log($scope.data);
								httpparams.method = 'post';
								httpparams.url = SERVER_URL + "user/create";
							} else {
								console.log($scope.user);
								data.id = $scope.user.id;
								httpparams.method = 'put';
								httpparams.url = SERVER_URL + "user/update";
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
															"saveUserError", {});
													console.log(data);
													$scope.hide();
													$scope.message = 'Something went worng. Please try again later.';
													$scope.showToast();
												}else{
													$scope.displayProgressBar = false;
													$scope.message = 'User Information saved successfully.';
													$scope.showToast();
													$rootScope.$emit("CallPopulateUserList",{});
												}
											},
											function errorCallback(data) {
												$rootScope.$emit(
														"saveUserError", {});
												console.log(data);
												$scope.hide();
												$scope.message = 'Something went worng. Please try again later.';
												$scope.showToast();
											});
							 /*$rootScope.$emit("callProgressBar",{});*/
						}

						$scope.submitInformation = function(isvaliduser,$event) {
							if (isvaliduser) {
							/*  $rootScope.$emit("callProgressBar",{});*/
								$scope.saveUser($event);
								
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
													$scope.saveUser(ev);
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
							$scope.users = response.data;

							console.log(response);

						}, function errorCallback(response) {
							console.log("Error");

						});
						
					/*	$rootScope.$on("callProgressBar", function($event){
							$scope.showProgressBar();
						});*/
						
						
						

					};

					$scope.deleteUser = function(index) {
						/* $scope.user = $scope.users[index].id; */
						console.log($scope.user);

						$http(
								{
									method : 'delete',
									url : SERVER_URL + "user/delete/"
											+ $scope.users[index].id

								}).then(function successCallback(data) {
									$mdDialog.hide();
							$rootScope.$emit("CallPopulateUserList", {});
							console.log(data);
							/*$mdDialog.hide();*/
						}, function errorCallback(data) {
							console.log("Error");

						});

						$scope.showProgressBarOne();
					};

					$scope.showEditUser = function(ev, index) {
						$scope.information ="EDIT USER INFORMATION"
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.user = $scope.users[index];
						console.log($scope.user);
						$mdDialog
								.show({
									controller : DialogController,
									templateUrl : 'views/userInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										user : $scope.user,
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

					$scope.viewUserInformation = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.user = $scope.users[index];
						$scope.isSaving = false;
						$scope.information ="VIEW USER INFORMATION"
						console.log($scope.user);
						$mdDialog.show({
									controller : DialogController,
									templateUrl : 'views/userInformation.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										user : $scope.user,
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
								'Are you sure you want to Delete User Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');

						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteUser(index);
											
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