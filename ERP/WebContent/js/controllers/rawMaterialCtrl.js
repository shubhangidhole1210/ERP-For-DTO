erpApp.controller('rawMaterialCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils) {
	$scope.isRmPresent=false;
	$rootScope.$on("CallPopulateRawMaterial", function() {
		$scope.populateRawMaterial();
	});
	$rootScope.$on("saveRawmaterialError", function() {
		$scope.showAddRawMaterial();
	});
	
	$scope.populateRawMaterial=function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterial/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.rawMaterials = response.data;
			$scope.getRawMaterialInformation();
			console.log(response);
			utils.hideProgressBar();
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
}
	
	$scope.getRawMaterialInformation = function() {
		$scope.isRmPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.rawMaterial = {};
	$scope.showAddRawMaterial = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.rawMaterial = {};
		$scope.information="ADD RAW MATERIAL INFORMATION"
		var addNewrawmaterialDialog = {
			controller : 'rawMaterialDialogCtrl',
			templateUrl : 'views/rawMaterialDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				rawMaterial : $scope.rawMaterial,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewrawmaterialDialog)
		.then(function(answer) {},
				function() {});
	};
	
	$scope.showEditRM = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.rawMaterial = $scope.rawMaterials[index];
		console.log($scope.user);
		$scope.information = "EDIT RAW MATERIAL INFORMATION"
		$mdDialog
				.show({
					controller : 'rawMaterialDialogCtrl',
					templateUrl : 'views/rawMaterialDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						rawMaterial : $scope.rawMaterial,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	$scope.viewRMInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.rawMaterial = $scope.rawMaterials[index];
		$scope.isSaving = false;
		console.log($scope.rawMaterial);
		$scope.information="VIEW RAW MATERIAL INFORMATION"
		$mdDialog.show({
					controller : 'rawMaterialDialogCtrl',
					templateUrl : 'views/rawMaterialDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						rawMaterial : $scope.rawMaterial,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
				})
				.then(function(answer) {},
						function() {});
	};
	
	
	$scope.deleteraeMaterial= function(index) {
		console.log($scope.rawmaterial);
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "rawmaterial/delete/" + $scope.rawMaterials[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			 utils.hideProgressBar();;
			$rootScope.$emit("CallPopulateRawMaterial", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		utils.showProgressBar();
	};
	
	$scope.showConfirm = function(ev,index) {
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete Raw Material Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteraeMaterial(index);
							utils.showToast('Raw Material Deleted Sucessfully!');
							
							
						},
						function() { });
	};
	
	
	
	
});
