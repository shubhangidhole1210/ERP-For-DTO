erpApp.controller('clientCtrl',function($scope, $mdDialog, client,
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
				contactpersonname: $scope.client.contactpersonname,
				createdBy:2,
				created_date:null,
				updatedBy:1,
				updated_date:null,
				isactive:true
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
								/*$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();*/
								$scope.message = 'Something went worng. Please try again later.';
								utils.showToast();
							}
							else if(data.data.code === 2)
								{
								console.log(data.data.message);
								$rootScope.$emit(
										"saveClientError", {});
								console.log(data);
								$scope.hide();
								$scope.message = data.data.message;
								utils.showToast();
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
							/*$scope.message = 'Something went worng. Please try again later.';
							$scope.showToast();*/
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

	/*$scope.showToast = function() {
		$mdToast.show({
			hideDelay : 3000,
			position : 'top right',
			controller : 'ToastCtrl',
			templateUrl : 'views/toast.html',
			locals : {
				message : $scope.message
			}
		});
	};*/
	
	/*$scope.showProgressBar = function(ev) {
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
								$scope.saveClient(ev);
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
	};*/
	
	$http({
		method : 'GET',
		url : SERVER_URL + "usertype/list"
	}).then(function successCallback(response) {
		$scope.data = response.data;
	/*	$scope.users = response.data;*/

		console.log(response);

	}, function errorCallback(response) {
		console.log("Error");

	});
});