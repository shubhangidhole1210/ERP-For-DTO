erpApp.controller('notificationUserAssociationDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,notificationUser,action,flag,information) {
	
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.notificationUser = notificationUser;
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
	
	$scope.getNotificationInformation=function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "notification/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.notificationList=response.data;
			console.log(response)
			console.log("$scope.notificationList :" ,$scope.notificationList);
			utils.hideProgressBar();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			utils.hideProgressBar();
			console.log("Error");
		});
	};
	
	$scope.getUserInformation=function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "user/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.userList=response.data;
			console.log(response)
			console.log("$scope.userList :" ,$scope.userList);
			utils.hideProgressBar();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			utils.hideProgressBar();
			console.log("Error");
		});
	};
	

	$scope.saveNotificationUserAssociationInformation = function(ev) {
		var data = {
				user:$scope.notificationUser.user.userId,
				notification :$scope.notificationUser.notification.notificationId,
				"cc":"shahaaa@gmail.com"
				
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.user);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "notificationuserassociation/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.unit);
			data.id = $scope.notificationUser.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "notificationuserassociation/update";
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

	$scope.submitNotificationUserAssociationForm = function(notificationId,userId) {
			/*$scope.saveNotificationUserAssociationInformation()*/
		console.log("notification id :" , notificationId);
		console.log("user id :" , userId);
		if(notificationId == null && userId == null){
			utils.showToast("Please Select Notification Id and User Id")
		}else if(notificationId == null){
			utils.showToast("Please select Notification id");
		}else if(userId == null){
			utils.showToast("Please select User id");
		}
	};
});