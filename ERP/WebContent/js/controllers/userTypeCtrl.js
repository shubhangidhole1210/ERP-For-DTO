erpApp.controller('userTypeCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth)
{
	
	$rootScope.$on("CallPopulateUserTypeList", function() {
		$scope.populateUserTypeList();
	});
	$rootScope.$on("saveUserTypeError", function() {
		$scope.showAddNewUserType();
	});
	$scope.populateUserTypeList=function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "usertype/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		/*$http({
			method : 'GET',
			url : SERVER_URL + 'UserType/list',
			headers : {"auth_token" : Auth.getAuthToken()}
		})*/	
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.UserTypes=response.data;
			$scope.isUserTypeInformation()
			console.log(response)
			$mdDialog.hide();
		}, function errorCallback(response) {
			$scope.message = "We are Sorry. Something went wrong. Please try again later."
			$scope.showToast();
			console.log("Error");
			$mdDialog.hide();
		});
		$scope.showProgressBarOne();
	}
	$scope.isUserTypeInPresent=false; 
	$scope.isUserTypeInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isUserTypeInPresent=true; 
			}
		else
			{
			$scope.isUserTypeInPresent=false; 
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
	$scope.UserType={}
	$scope.showAddNewUserType = function(ev) {
		$scope.UserType={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW UserType"
		var abc = {
			controller : userTypeController,
			templateUrl : 'views/userTypeInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				userType : $scope.userType,
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
	
	
	function userTypeController($scope, $mdDialog,userType,action,flag,$mdToast,information) {
		$scope.isReadOnly = action;
		$scope.flag = flag;
		$scope.userType = userType;
		$scope.information = information;
		/*$scope.user.dob = new Date($scope.user.dob);
		$scope.user.doj = new Date($scope.user.doj);*/
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

		$scope.saveUserTypeInformation = function(ev) {
			
			
			var data = {

					usertypeName : $scope.userType.usertypeName,
					description : $scope.userType.description,
				     created_by : null,
				     /*created_date : null,*/
				     updated_by : null,
				     /*updated_date : null,*/
				     isactive : true
			};
			var httpparams = {};
			if ($scope.flag == 0) {
				console.log($scope.user);
				console.log($scope.data);
				/*httpparams.method = 'post';
				httpparams.url = SERVER_URL + "UserType/create";*/
				httpparams.method = 'post';
				httpparams.url = SERVER_URL + "usertype/create";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
			} else {
				console.log($scope.UserType);
				data.id = $scope.UserType.id;
				/*httpparams.method = 'put';
				httpparams.url = SERVER_URL + "UserType/update";*/
				httpparams.method = 'put';
				httpparams.url = SERVER_URL + "usertype/update";
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
											"saveUserTypeError", {});
									console.log(data);
									$scope.hide();
									$scope.message = 'Something went worng. Please try again later.';
									$scope.showToast();
								}else{
									$scope.displayProgressBar = false;
									$scope.message = 'UserType Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("CallPopulateUserTypeList",{});
								}
							},
							function errorCallback(data) {
								$rootScope.$emit(
										"saveUserTypeError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							});

		}

		$scope.submitUserTypeInformation = function(isvaliduser,$event) {
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
									$scope.saveUserTypeInformation(ev);
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
		
		
	  }
	
	$scope.showEditUserType = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.UserType = $scope.UserTypes[index];
		$scope.information = "EDIT UserType INFORMATION"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : userTypeController,
					templateUrl : 'views/userTypeInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						userType : $scope.userType,
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
	
	$scope.viewUserTypeInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.userType = $scope.userTypes[index];
		$scope.isSaving = false;
		$scope.information = "VIEW UserType INFORMATION"
		console.log($scope.UserType);
		$mdDialog.show({
					controller : userTypeController,
					templateUrl : 'views/UserTypeInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						userType : $scope.userType,
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
	
	$scope.deleteUserType = function(index) {
		/* $scope.user = $scope.users[index].id; */
		console.log($scope.userType);

		/*$http(
				{
					method : 'delete',
					url : SERVER_URL + "UserType/delete/"
							+ $scope.UserTypes[index].id

				})*/
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "userType/delete/" + $scope.userTypes[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("CallPopulateUserTypeList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		$scope.showProgressBarOne();

	};
	$scope.showConfirm = function(ev,index) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete UserType Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteUserType(index);
							
							$scope.message = 'Delete UserType sucessfully';
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