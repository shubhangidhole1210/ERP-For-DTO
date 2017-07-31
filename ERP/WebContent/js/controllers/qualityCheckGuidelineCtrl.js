erpApp.controller('qualityChcekGuidelineCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils)
{
	//$scope.isUnitInPresent=false; 
	$scope.QualityCheckGuideline={};
	
	$rootScope.$on("CallPopulateGuideLineList", function() {
		$scope.populateGuideLineList();
	});
	
	$rootScope.$on("saveGuideLineError", function() {
		$scope.addGuideLine();
	});
	
	$scope.populateGuideLineList=function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "qcGuideline/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.QualityCheckGuidelineList=response.data;
			console.log("$scope.QualityCheckGuidelineList:" ,$scope.QualityCheckGuidelineList);
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
	
	$scope.addGuideLine = function(ev) {
		$scope.QualityCheckGuideline={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "CREATE NEW GUIDE LINE";
		var addNewUnitDialog = {
			controller : 'qualityCheckGuidelineDialogCtrl',
			templateUrl : 'views/qualityCheckGuidelineDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				QualityCheckGuideline : $scope.QualityCheckGuideline,
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
	
	$scope.showEditGuideLine = function(ev, $index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.QualityCheckGuideline = $scope.QualityCheckGuidelineList[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.information = "EDIT  GUIDE LINE";
		console.log($scope.user);
		$mdDialog
				.show({
					controller : 'qualityCheckGuidelineDialogCtrl',
					templateUrl : 'views/qualityCheckGuidelineDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						QualityCheckGuideline : $scope.QualityCheckGuideline,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	$scope.viewGuideLine = function(ev, $index){
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.QualityCheckGuideline = $scope.QualityCheckGuidelineList[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.isSaving = false;
		$scope.information = "VIEW GUIDE LINE INFORMATION";
		console.log($scope.unit);
		$mdDialog.show({
					controller : 'qualityCheckGuidelineDialogCtrl',
					templateUrl : 'views/qualityCheckGuidelineDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						QualityCheckGuideline : $scope.QualityCheckGuideline,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	$scope.deleteGuideLine = function(index) {
		console.log($scope.QualityCheckGuideline);
		console.log('$scope.units' , $scope.QualityCheckGuideline);
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "qcGuideline/delete/" + $scope.QualityCheckGuidelineList[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			utils.showToast('GuideLine Deleted Sucessfully!');
			$rootScope.$emit("CallPopulateGuideLineList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			
		});
		utils.showProgressBar();
	};
	$scope.showConfirm = function(ev,$index) {
		var confirm = $mdDialog.confirm().title('Are you sure you want to Delete Guide Line Information?')
				.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

		$mdDialog.show(confirm)
				.then(function() {
					$scope.deleteGuideLine(($scope.currentPage*$scope.pageSize) + ($index));
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