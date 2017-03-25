erpApp.controller('RMInvenaryDialogeController',
				function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, rmInventary, $location, flag, action, information) {
	
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

				rawmaterial:$scope.rmInventary.rawmaterial.id,
				quantityAvailable:$scope.rmInventary.quantityAvailable,
				name:$scope.rmInventary.name,
				description:$scope.rmInventary.description
				
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.rmInventary);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "rawmaterialinventory/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.rmInventary);
			data.id = $scope.rmInventary.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "rawmaterialinventory/update";
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
										"saveRMInventaryError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
							}else{
								$scope.displayProgressBar = false;
								utils.showToast('Raw material inventory Information saved successfully.');
								$rootScope.$emit("CallPopulateRMInventaryList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveRMInventaryError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});

	}

	$scope.submitRMInventaryInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveRMInventaryInformation(event);
			
		} else {
			console.log('its else block');
		}

	}

	var httpparams = {};
	httpparams.method = 'GET';
	httpparams.url = SERVER_URL + "rawmaterial/list";
	httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
	
	$http(httpparams).then(function successCallback(response) {
		$scope.data = response.data;
		$scope.users = response.data;

		console.log(response);

	}, function errorCallback(response) {
		console.log("Error");

	});
	
});