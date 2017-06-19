erpApp.controller('statusCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils){
	$scope.isStatusPresent=false;
	
	$rootScope.$on("callPopulateStatusList", function() {
		$scope.populateStatusList();
	});
	$rootScope.$on("saveUnitError", function() {
		$scope.showAddNewStatus();
	});
	
	$scope.populateStatusList=function(){
		 $scope.currentPage = 0;
		    $scope.pageSize = 15;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "status/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.statuss=response.data;
			$scope.isStatusInformation();
			console.log(response)
			utils.hideProgressBar();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	$scope.isStatusInformation = function() {
		$scope.isStatusPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.status={};
	$scope.showAddNewStatus = function(ev) {
		$scope.status={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW STATUS"
		var addNewStatusDialog = {
			controller : 'StatusDialogueController',
			templateUrl : 'views/statusDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			fullscreen : $scope.customFullscreen,
			locals : {
				status : $scope.status,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewStatusDialog)
		.then(function() {},
				function() {});
	};
	
	$scope.showEditStatus = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.status = $scope.statuss[index];
		$scope.information = "EDIT STATUS INFORMATION"
		console.log($scope.status);
		$mdDialog
				.show({
					controller : 'StatusDialogueController',
					templateUrl : 'views/statusDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						status : $scope.status,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				}).then(function(answer) {},
						function() {});
	};
	
	$scope.viewStatusInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.status = $scope.statuss[index];
		$scope.isSaving = false;
		$scope.information = "VIEW STATUS INFORMATION"
		console.log($scope.status);
		$mdDialog.show({
					controller : 'StatusDialogueController',
					templateUrl : 'views/statusDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						status : $scope.status,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				});
	};
	
	$scope.deleteStatus = function(index) {
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "status/delete/" + $scope.statuss[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("callPopulateStatusList", {});
			console.log(data);
		}, function errorCallback(data) {
			console.log("Error");
		});
		$scope.showProgressBarOne();
	};
	
	$scope.showConfirm = function(ev,index) {
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to delete Status Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');
		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.deleteStatus(index);
							utils.showToast('Delete Status successfully');
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