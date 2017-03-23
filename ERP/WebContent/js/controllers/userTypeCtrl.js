erpApp.controller('userTypeCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils)
{
	
/*	$rootScope.$on("CallPopulateUserTypeList", function() {
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
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.UserTypes=response.data;
			$scope.isUserTypeInformation()
			console.log(response)
			utils.hideProgressBar();
		}, function errorCallback(response) {
			$scope.showToast('We are Sorry. Something went wrong. Please try again later.');
			console.log("Error");
			utils.hideProgressBar();
		});
		utils.showProgressBar();
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
	$scope.UserType={}
	$scope.showAddNewUserType = function(ev) {
		$scope.UserType={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW UserType"
		var addNewUserTypeDialog = {
			controller : 'userTypeDialogCtrl',
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
		$mdDialog
		.show(addNewUserTypeDialog)
		.then(function(answer) {},
				function() {});
	};
	$scope.showEditUserType = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.UserType = $scope.UserTypes[index];
		$scope.information = "EDIT UserType INFORMATION"
		$mdDialog
				.show({
					controller : 'userTypeDialogCtrl',
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
				.then(function(answer) {},
						function() {});
	};
	
	$scope.viewUserTypeInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.UserType = $scope.UserTypes[index];
		$scope.isSaving = false;
		$scope.information = "VIEW UserType INFORMATION"
		console.log($scope.UserType);
		$mdDialog.show({
					controller : 'userTypeDialogCtrl',
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
				.then(function(answer) {},
						function() {});
	};
	
	$scope.deleteUserType = function(index) {
		console.log($scope.userType);
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
     utils.showProgressBar()
	};
	$scope.showConfirm = function(ev,index) {
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
							utils.showToast('Delete UserType sucessfully');
						},
						function() {});
	};*/
	
	$scope.isReadOnly = false;
	/*$scope.isUserUnavailable = false;*/
	
	$rootScope.$on("CallPopulateUserTypeList", function($event) {
		$scope.populateUserTypeList	();
	});
	$rootScope.$on("saveUserError", function() {
		$scope.showAddNewUser();
	});

	$scope.populateUserTypeList = function() {
		utils.showProgressBar();

		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "usertype/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {

							$scope.data = response.data;
							$scope.UserTypes = response.data;
							console.log(response);
							utils.hideProgressBar();
						},
						function errorCallback(response) {
							$scope.message = 
							utils.showToast("We are Sorry. Something went wrong. Please try again later.");
							console.log("Error");
							utils.hideProgressBar();

						});
	};
	$scope.userType = {};
	$scope.showAddNewUserType = function(ev) {
		$scope.information = "ADD NEW USER TYPE"
		$scope.flag = 0;
		$scope.isReadOnly = false;
		var addNewUserTypeDialog = {
				
			controller : 'userTypeDialogCtrl',
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
		};
		
		$mdDialog
		.show(addNewUserTypeDialog)
		.then(function(answer) {},
				function() {});
	};
	  
	$scope.showEditUserType = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.userType = $scope.UserTypes[index];
		$scope.information = "EDIT USER TYPE"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : 'userTypeDialogCtrl',
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
				.then(function(answer) {},
						function() {});
	};
	$scope.viewUserTypeInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.isSaving = false;
		$scope.userType = $scope.UserTypes[index];
		console.log($scope.unit);
		$mdDialog.show({
					controller : 'userTypeDialogCtrl',
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
						function(answer) {},
						function() {});
	};
	$scope.deleteUserType = function(index) {
		console.log($scope.userType);
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
     utils.showProgressBar()
	};
	$scope.showConfirm = function(ev,index) {
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
							utils.showToast('Delete UserType sucessfully');
						},
						function() {});
	};
	
	
	
	
	
});