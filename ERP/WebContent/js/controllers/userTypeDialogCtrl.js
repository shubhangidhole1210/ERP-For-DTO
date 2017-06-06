erpApp.controller('userTypeDialogCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, userType, $location, flag, action, information){
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.userType = userType;
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

	$scope.saveUserTypeInformation = function(ev) {
		var data = {
				usertypeName : $scope.userType.usertypeName,
				description : $scope.userType.description
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.user);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "usertype/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.UserType);
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
								utils.showToast('Something went worng. Please try again later.')
							}else{
								$scope.displayProgressBar = false;
								utils.showToast('UserType Information saved successfully.')
								$rootScope.$emit("CallPopulateUserTypeList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveUserTypeError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.')
						});
	}

	$scope.submitUserTypeInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveUserTypeInformation($event);
		} else {
			console.log('its else block');
		}
	}
	
});