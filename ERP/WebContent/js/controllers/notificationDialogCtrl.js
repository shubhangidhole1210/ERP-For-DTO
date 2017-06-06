erpApp.controller('notificationDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,notification,action,flag,information) {
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.notification = notification;
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

	$scope.saveNotificationInformation = function(ev) {
		var data = {
				beanClass :  $scope.notification.beanClass ,
				description: $scope.notification.description,
				name: $scope.notification.name,
				subject: $scope.notification.subject ,
				template: $scope.notification.template,
				type: $scope.notification.type,
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.user);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "notification/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.unit);
			data.id = $scope.notification.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "notification/update";
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
								utils.showToast('Something went worng. Please try again later.');
							}else{
								$scope.displayProgressBar = false;
								utils.showToast('Notification Information saved successfully.');
								$rootScope.$emit("CallPopulateNotificationList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveUnitError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	};

	$scope.submitnotificationForm = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveNotificationInformation($event)
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
});