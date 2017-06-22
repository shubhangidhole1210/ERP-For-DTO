erpApp.controller('notificationUserAssociationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
     $scope.isNotificationPresent=false;
     $scope.notificationUser={};
     
	$rootScope.$on("CallPopulateNotificationList", function() {
		$scope.populateNotificationUserAssociationList();
	});
	
	$rootScope.$on("saveUnitError", function() {
		$scope.addNewNotificationUserAssociation();
	});
	
	$scope.populateNotificationUserAssociationList=function(){
		console.log("in populateNotificationUserAssociationList")
		$scope.currentPage = 0;
	     $scope.pageSize = 15;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "notificationuserassociation/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.notificationUserAssociationList=response.data;
			console.log(response)
			console.log("$scope.notificationUserAssociationList :" ,$scope.notificationUserAssociationList);
			utils.hideProgressBar();
		}, function errorCallback(response) {
			console.log(data.data.message);
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			utils.hideProgressBar();
			console.log("Error");
		});
	};
	
	$scope.addNewNotificationUserAssociation = function(ev) {
		$scope.notificationUser={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW NOTIFICATION USER ASSOCIATION";
		var addNewNotificationDialog = {
			controller : 'notificationUserAssociationDialogCtrl',
			templateUrl : 'views/notificationUserAssociationDialogue.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : true,
			locals : {
				notificationUser : $scope.notificationUser,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewNotificationDialog)
		.then(function(answer) {},
				function() {});
	};

	$scope.showEditNotificationUserAssociation = function(ev, $index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.notificationUser = $scope.notificationUserAssociationList[($scope.currentPage*$scope.pageSize) + ($index)];
		console.log("")
		$scope.information = "EDIT NOTIFICATION USER ASSOCIATION INFORMATION"
		console.log($scope.notification);
		$mdDialog
				.show({
					controller : 'notificationUserAssociationDialogCtrl',
					templateUrl : 'views/notificationUserAssociationDialogue.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : true,
					locals : {
						notificationUser : $scope.notificationUser,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	$scope.viewNotificationUserAssociationInformation = function(ev, $index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.notificationUser = $scope.notificationUserAssociationList[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.isSaving = false;
		$scope.information = "VIEW NOTIFICATION USER ASSOCIATION INFORMATION"
		console.log($scope.notification);
		$mdDialog.show({
					controller : 'notificationUserAssociationDialogCtrl',
					templateUrl : 'views/notificationUserAssociationDialogue.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						notificationUser : $scope.notificationUser,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	$scope.deleteNotificationUserAssociation = function(index) {
		utils.showProgressBar();
		 $scope.notificationUser = $scope.notificationUserAssociationList[index].id; 
		console.log($scope.page);
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "notificationuserassociation/delete/" + $scope.notificationUserAssociationList[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			utils.hideProgressBar();
			$rootScope.$emit("CallPopulateNotificationList", {});
			console.log(data);
			if(data.data.code === 0){
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			}else{
				utils.showToast("Notification User Association Deleted sucessfully");
			}

		}, function errorCallback(data) {
			console.log("Error");
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
		});
	};
	
	$scope.showConfirm = function(ev,$index) {
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete Notification Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');
		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteNotificationUserAssociation(($scope.currentPage*$scope.pageSize) + ($index));
						},
						function() {
							$scope.status = 'You decided to keep your debt.';
						});
	};
	
	$scope.gotoPrevPage = function(){
		 utils.scrollToTop();
		 $scope.currentPage = $scope.currentPage - 1;
	};
	
	$scope.gotoNextPage = function(){
		 utils.scrollToTop();
		 $scope.currentPage = $scope.currentPage + 1;
	};
	
});
