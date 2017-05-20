erpApp.controller('rawMaterialDialogCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,flag,action,information,rawMaterial,$location,unitAction) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.rawMaterial = rawMaterial;
	$scope.information= information;
	$scope.isUnitReadOnly = unitAction;
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

	$scope.saveRawMaterial = function(ev) {
		
		
		var data = {

				name:$scope.rawMaterial.name,
				description:$scope.rawMaterial.description,
				partNumber:$scope.rawMaterial.partNumber,
				unit:$scope.rawMaterial.unit.id,
				pricePerUnit:$scope.rawMaterial.pricePerUnit
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.user);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "rawmaterial/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.rawMaterial);
			data.id = $scope.rawMaterial.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "rawmaterial/update";
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
										"saveRawmaterialError", {});
								console.log(data);
								$scope.hide();
								/*$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();*/
								utils.showToast('Something went worng. Please try again later.');
							}else{
								$scope.displayProgressBar = false;
								/*$scope.message = 'Raw material Information saved successfully.';
								$scope.showToast();*/
								utils.showToast('Raw material Information saved successfully.');
								$rootScope.$emit("CallPopulateRawMaterial",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveRawmaterialError", {});
							console.log(data);
							$scope.hide();
							/*$scope.message = 'Something went worng. Please try again later.';
							$scope.showToast();*/
							utils.showToast('Something went worng. Please try again later.');
						});

	}

	$scope.submitRMInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			/*utils.showProgressBar();*/
			$scope.saveRawMaterial($event)
			
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}

	}

	$scope.getUnitList= function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "unit/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
		

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}


	
});