erpApp.controller('rmTypeCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils)
{
	$scope.isUnitInPresent=false; 
	$scope.unit={}
	
	$rootScope.$on("CallPopulateUnitList", function() {
		$scope.populateUnitList();
	});
	
	$rootScope.$on("saveUnitError", function() {
		$scope.showAddNewUnit();
	});
	
	$scope.populateRmTypeList=function(){
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rmtype/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.rmTypes=response.data;
			//$scope.isUnitInformation()
			console.log(response);
			console.log("$scope.rmTypes : ", $scope.rmTypes);
			utils.hideProgressBar();
		}, function errorCallback(response) {
			$scope.message = 
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
			   utils.hideProgressBar();
		});
	};
	
	$scope.isUnitInformation = function() {
		$scope.isUnitInPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.showAddNewUnit = function(ev) {
		$scope.unit={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW UNIT"
		var addNewUnitDialog = {
			controller : 'unitDialogCtrl',
			templateUrl : 'views/unitDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				unit : $scope.unit,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		$mdDialog
		.show(addNewUnitDialog)
		.then(function(answer) {},
				function() {});
	};
	
	$scope.showEditUnit = function(ev, $index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.unit = $scope.units[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.information = "EDIT UNIT INFORMATION"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : 'unitDialogCtrl',
					templateUrl : 'views/unitDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						unit : $scope.unit,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	$scope.viewUnitInformation = function(ev, $index){
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.unit = $scope.units[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.isSaving = false;
		$scope.information = "VIEW UNIT INFORMATION"
		console.log($scope.unit);
		$mdDialog.show({
					controller : 'unitDialogCtrl',
					templateUrl : 'views/unitDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						unit : $scope.unit,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	$scope.deleteUnit = function(index) {
		console.log($scope.unit);
		console.log('$scope.units' , $scope.units)
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "unit/delete/" + $scope.units[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			utils.showToast('Unit Deleted Sucessfully!');
			$rootScope.$emit("CallPopulateUnitList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			
		});
		utils.showProgressBar();
	};
	$scope.showConfirm = function(ev,$index) {
		var confirm = $mdDialog.confirm().title('Are you sure you want to Delete Unit Information?')
				.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteUnit(($scope.currentPage*$scope.pageSize) + ($index));
				}, function() {});
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