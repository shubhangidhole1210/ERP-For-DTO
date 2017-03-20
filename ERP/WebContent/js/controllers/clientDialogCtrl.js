erpApp.controller('clientDialogCtrl',function($scope, $mdDialog, client,
		$location, $rootScope,SERVER_URL,flag,action,information,Auth,$http,utils)
{
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.client = client;
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

	$scope.saveClient = function(ev) {
		
		
		var data = {

				companyname: $scope.client.companyname,
				description: $scope.client.description,
				address: $scope.client.address,
				emailid: $scope.client.emailid,
				contactnumber:$scope.client.contactnumber ,
				contactpersonname: $scope.client.contactpersonname
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.user);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "client/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.client);
			data.id = $scope.client.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "client/update";
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
										"saveClientError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
							}
							else if(data.data.code === 2)
								{
								console.log(data.data.message);
								$rootScope.$emit(
										"saveClientError", {});
								console.log(data);
								$scope.hide();
								/*$scope.message = data.data.message;*/
								utils.showToast(data.data.message);
								}
							else{
								$scope.displayProgressBar = false;
								/*$scope.message = 'Client Information saved successfully.';
								$scope.showToast();*/
								utils.showToast('User Information saved successfully.');
								$rootScope.$emit("CallPopulateClientList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveClientError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});

	}

	$scope.submitClientInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveClient();
			$scope.showProgressBar($event);
			
		} else {
			console.log('its else block');
		}

	}

	$http({
		method : 'GET',
		url : SERVER_URL + "usertype/list"
	}).then(function successCallback(response) {
		$scope.data = response.data;
		console.log(response);

	}, function errorCallback(response) {
		console.log("Error");

	});
});