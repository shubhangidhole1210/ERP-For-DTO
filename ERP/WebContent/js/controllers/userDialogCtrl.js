erpApp
		.controller(
				'userDialogCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, utils, Auth, user, $location, flag, action,
						information) {
					$scope.isReadOnly = action;
					$scope.flag = flag;
					$scope.user = user;
					$scope.information = information;
					$scope.user.dob = new Date($scope.user.dob);
					$scope.user.doj = new Date($scope.user.doj);
					$scope.isUserType = false;
					$scope.isUserTypeDisabled = true;
					
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

					$scope.birthDateValidation = function(dob) {
						$scope.today = new Date();
						var minAge = 18;
						$scope.minAge = new Date($scope.today.getFullYear()
								- minAge, $scope.today.getMonth(), $scope.today
								.getDate());
						console.log("currentDate" + $scope.today);
						console.log("min age" + $scope.minAge);
						console.log("date of birth" + dob);
						if (dob > $scope.minAge) {
							$scope.invalidDOBMsg = "Invalid date!! Date of birth should be at least before 18 years of current year";
							$scope.userInformation.dob.$setValidity(
									"customMsg1", false);
						} else {
							$scope.userInformation.dob.$setValidity(
									"customMsg1", true);
						}
					};

					$scope.validateJoiningDate = function(dob, doj) {
						var currentDate = new Date();
						console.log("current date : " + $scope.currentDate);
						console.log("doj : " + doj);
						var maxAge = 18;
						$scope.maxAge = new Date(dob.getFullYear() + maxAge,
								dob.getMonth(), dob.getDate());
						console.log("max age " + $scope.maxAge);
						if (doj >= currentDate) {
							$scope.invalidDOJMsg = "Invalid date!! Joining date should not be in future";
							$scope.userInformation.doj.$setValidity(
									"customMsg", false);
						} else if (doj <= $scope.maxAge) {
							$scope.invalidDOJMsg = "Invalid date!! Joining date should be 18 year greater then Birth date";
							$scope.userInformation.doj.$setValidity(
									"customMsg", false);
						} else {
							console.log("else block");
							$scope.userInformation.doj.$setValidity(
									"customMsg", true);
						}
					};

					$scope.saveUser = function(ev) {
						var data = {
						    userId : $scope.user.userId,
						    password: $scope.user.password,
						    firstName : $scope.user.firstName,
						    lastName : $scope.user.lastName,
						    mobileNo : $scope.user.mobileNo,
						    emailId : $scope.user.emailId,
							userType : $scope.user.userType.id,
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
												utils
														.showToast('Something went worng. Please try again later.');
											} else if (data.data.code === 2) {
												$rootScope.$emit(
														"saveUserError", {});
												console.log($scope.message);
												utils
														.showToast(data.data.message);
												$scope.userInformation.email.$setValidity("apierror", true);
												$scope.message = data.data.message;
												console.log("$scope.message: " ,$scope.message);
											} else {
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
											utils
													.showToast('Something went worng. Please try again later.');
										});
					}

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveUser(event);
						} else {
							console.log('its else block');
							utils
									.showToast('Please fill all required information');
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

					$scope.getUserType = function() {
						httpparams = {
							method : 'GET',
							url : SERVER_URL + "usertype/list"
						};
						httpparams.headers = {
							"auth_token" : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.data = response.data;
									$scope.users = response.data;
									console.log(response);
								}, function errorCallback(response) {
									console.log("Error");
								});
					}
					
					$scope.isUserTypePresent = function(){
						$scope.isUserType =  $scope.users.length === 0? true : false;
						$scope.isUserTypeDisabled = $scope.users.length === 0? false : true;
					}
		});
