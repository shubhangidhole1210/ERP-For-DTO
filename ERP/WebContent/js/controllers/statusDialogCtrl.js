erpApp.controller('StatusDialogueController',
				function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, status, $location, flag, action, information){
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.status = status;
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

	$scope.saveStatusInformation = function(ev) {
		
		
		var data = {

				name : $scope.status.name,
		        description : $scope.status.description,
		        type : $scope.status.type
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.status);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "status/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.status);
			data.id = $scope.status.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "status/update";
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
										"saveUnitError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.')
							}else{
								$scope.displayProgressBar = false;
								utils.showToast('Status Information saved successfully.')
								$rootScope.$emit("callPopulateStatusList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveUnitError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.')
						});

	}

	$scope.submitStatusInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveStatusInformation(event)
			
		} else {
			console.log('its else block');
		}

	}

});