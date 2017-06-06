erpApp.controller('pageCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
     $scope.isPagePresent=false;
     $scope.page={}
     
	$rootScope.$on("CallPopulatePageList", function() {
		$scope.populatePageList();
	});
	
	$rootScope.$on("saveUnitError", function() {
		$scope.showAddNewPage();
	});
	
	$scope.populatePageList=function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "page/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.pages=response.data;
			$scope.isPageformation();
			console.log(response)
			utils.hideProgressBar();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			utils.hideProgressBar();
			console.log("Error");
		});
	};
	
	$scope.isPageformation = function() {
		$scope.isPagePresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.showAddNewPage = function(ev) {
		$scope.page={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW PAGE"
		var addNewPageDialog = {
			controller : 'pageDialogController',
			templateUrl : 'views/pageDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				page : $scope.page,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewPageDialog)
		.then(function(answer) {},
				function() {});
	};
	
	$scope.showEditPage = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.page = $scope.pages[index];
		$scope.information = "EDIT PAGE INFORMATION"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : 'pageDialogController',
					templateUrl : 'views/pageDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						page : $scope.page,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	$scope.viewPageInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.page = $scope.pages[index];
		$scope.isSaving = false;
		$scope.information = "VIEW PAGE INFORMATION"
		console.log($scope.unit);
		$mdDialog.show({
					controller : 'pageDialogController',
					templateUrl : 'views/pageDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						page : $scope.page,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(
						function(answer) {},
						function() {});
	};
	
	$scope.deletePage = function(index) {
		utils.showProgressBar();
		 $scope.page = $scope.pages[index].id; 
		console.log($scope.page);
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "page/delete/" + $scope.pages[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			utils.hideProgressBar();
			$rootScope.$emit("CallPopulatePageList", {});
			console.log(data);
			$scope.message = 'Delete page sucessfully';
			$scope.showToast();

		}, function errorCallback(data) {
			console.log("Error");
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
		});
	};
	
	$scope.showConfirm = function(ev,index) {
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete page Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');
		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deletePage(index);
						},
						function() {
							$scope.status = 'You decided to keep your debt.';
						});
	};
});
