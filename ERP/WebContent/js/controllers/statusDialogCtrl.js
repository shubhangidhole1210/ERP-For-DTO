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
		        type : $scope.status.type,
		        isactive : true
				
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
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							}else{
								$scope.displayProgressBar = false;
								$scope.message = 'Status Information saved successfully.';
								$scope.showToast();
								$rootScope.$emit("callPopulateStatusList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveUnitError", {});
							console.log(data);
							$scope.hide();
							$scope.message = 'Something went worng. Please try again later.';
							$scope.showToast();
						});

	}

	$scope.submitStatusInformation = function(isvaliduser,$event) {
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
								$scope.saveStatusInformation(ev);
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
});