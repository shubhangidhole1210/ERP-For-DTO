erpApp.controller('userDialogCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, user, $location, flag, action, information) {

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
							dob : $scope.user.dob
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
						httpparams.headers = {
							"auth_token" : Auth.getAuthToken()
						};
						httpparams.data = data;
						$http(httpparams)
								.then(
										function successCallback(data) {
											$mdDialog.hide();
											console.log(data);
											if (data.data.code === 0) {
												console.log(data.data.message);
												$rootScope.$emit(
														"saveUserError", {});
												console.log(data);
												$scope.hide();
												/*$scope.message = 'Something went worng. Please try again later.';*/
												utils.showToast('Something went worng. Please try again later.');
											}
                                             
											/*else if(data.data.message !== 'User added Successfully !')*/
											else if(data.data.code === 2)
											{
												$rootScope.$emit("saveUserError",
														{});
												$scope.message = data.data.message;
												$scope.userInformation.userid.$setValidity("apierror", false);
												$scope.userInformation.mobile.$setValidity("apierror", false);
												$scope.userInformation.email.$setValidity("apierror", false);
												console.log($scope.message);
												utils.showToast(data.data.message);
											}

											else {
												$scope.displayProgressBar = false;
												utils
														.showToast('user information save sucessfully');
												
												$rootScope.$emit(
														"CallPopulateUserList",
														{});
											}
											
										},
										function errorCallback(data) {
											$rootScope.$emit("saveUserError",
													{});
											console.log(data);
											$scope.hide();
											utils.showToast('Something went worng. Please try again later.');
										});
					}

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveUser($event);
						} else {
							console.log('its else block');
						}
					};

					$scope.checkDate = function(dob, doj) {
						$scope.errorMessage = '';
						var currentDate = new Date();
						if (new Date(dob) > new Date(doj)) {
							console.log('its if condition')
						} else {
							console.log('its else condition')
						}
					};
					
					$scope.getUserType=function(){
						httpparams = {
								method : 'GET',
								url : SERVER_URL + "usertype/list"
							};
							httpparams.headers = {
								"auth_token" : Auth.getAuthToken()
							};
							$http(httpparams).then(function successCallback(response) {
								$scope.data = response.data;
								$scope.users = response.data;
								console.log(response);
							}, function errorCallback(response) {
								console.log("Error");
							});
						
					}
					
					
					
					
});

