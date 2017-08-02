erpApp.controller('rmTypeDialogueController',
		function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, rmType, $location, flag, action, information) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.rmType = rmType;
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

	$scope.saveRMTypeInformation = function(ev) {
		var data = {
				rmTypeName : $scope.rmType.rmTypeName,
				description : $scope.rmType.description
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "rmtype/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			data.id = $scope.rmType.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "rmtype/update";
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
							if(data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveRmTypeError", {});
								console.log(data);
								$scope.hide();
								utils.showToast();
								utils.showToast(data.data.message);
							}else{
								$scope.displayProgressBar = false;
								$rootScope.$emit("CallPopulateRmTypeList",{});
								utils.showToast(data.data.message);
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveRmTypeError", {});
							console.log(data);
							$scope.hide();
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	};

	$scope.submitRMTypeInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveRMTypeInformation();
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
});