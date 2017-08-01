erpApp.controller('rmTypeCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils)
{
	$scope.isRmTypePresent=false; 
	$scope.rmType={};
	
	$rootScope.$on("CallPopulateRmTypeList", function() {
		$scope.populateRmTypeList();
	});
	
	$rootScope.$on("saveRmTypeError", function() {
		$scope.addNewRmType();
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
			$scope.rmTypeList=response.data;
			$scope.isRmTypeInformation();
			console.log(response);
			console.log("$scope.rmTypes : ", $scope.rmTypeList);
			utils.hideProgressBar();
		}, function errorCallback(response) {
			$scope.message = 
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
			   utils.hideProgressBar();
		});
	};
	
	$scope.isRmTypeInformation = function() {
		$scope.isRmTypePresent = $scope.rmTypeList.length === 0 ? true : false;
	};
	
	$scope.addNewRmType = function(ev) {
		$scope.rmType={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW RM TYPE";
		var addNewRmTypeDialog = {
			controller : 'rmTypeDialogueController',
			templateUrl : 'views/rmTypeDialoguehtml.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				rmType : $scope.rmType,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		$mdDialog
		.show(addNewRmTypeDialog)
		.then(function(answer) {},
				function() {});
	};
	
	$scope.EditRMType = function(ev, $index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.rmType = $scope.rmTypeList[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.information = "EDIT RM TYPE INFORMATION"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : 'rmTypeDialogueController',
					templateUrl : 'views/rmTypeDialoguehtml.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						rmType : $scope.rmType,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	$scope.viewRMTypenformation = function(ev, $index){
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.rmType = $scope.rmTypeList[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.isSaving = false;
		$scope.information = "VIEW RM TYPE INFORMATION"
		console.log($scope.unit);
		$mdDialog.show({
					controller : 'rmTypeDialogueController',
					templateUrl : 'views/rmTypeDialoguehtml.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						rmType : $scope.rmType,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	$scope.deleteRmType = function(index) {
		console.log($scope.unit);
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "unit/delete/" + $scope.rmTypeList[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			utils.showToast('RM Type Deleted Sucessfully!');
			$rootScope.$emit("CallPopulateRmTypeList", {});
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
					$scope.deleteRmType(($scope.currentPage*$scope.pageSize) + ($index));
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