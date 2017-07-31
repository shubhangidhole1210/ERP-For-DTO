erpApp.controller('qualityCheckGuidelineDialogCtrl',
		function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, QualityCheckGuideline, $location, flag, action, information) {
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.QualityCheckGuideline = QualityCheckGuideline;
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
	
	$scope.getRawMaterial=function(){
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterial/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			
			$scope.data = response.data;
			console.log("$scope.rawMaterials : ", $scope.rawMaterials);
		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
		});
};

$scope.getProductList=function(){
	var httpparams = {};
	httpparams.method = 'GET';
	httpparams.url = SERVER_URL + "product/list";
	httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
	$http(httpparams).then(function successCallback(response) {
		$scope.data = response.data;
		console.log("$scope.productList : ", $scope.productList);
	}, function errorCallback(response) {
		utils.showToast("We are Sorry. Something went wrong. Please try again later.");
		console.log("Error");
		utils.hideProgressBar();
	});
};

	

	$scope.saveQcGuideLineInformation = function(ev) {
		var data = {
				guidelines:$scope.QualityCheckGuideline.guidelines,
				rawMaterialId: $scope.QualityCheckGuideline.details.id,
				productId :$scope.QualityCheckGuideline.details.id

		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.QualityCheckGuideline);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "qcGuideline/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.QualityCheckGuideline);
			data.id = $scope.QualityCheckGuideline.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "qcGuideline/create";
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
							if(data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveGuideLineError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								utils.showToast();
							}else{
								$scope.displayProgressBar = false;
								$scope.message = 'Unit Information saved successfully.';
								$rootScope.$emit("CallPopulateGuideLineList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveGuideLineError", {});
							console.log(data);
							$scope.hide();
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	};

	$scope.submitQcGuideLineInformation = function(isvaliduser,$event){
		if (isvaliduser) {
			$scope.saveQcGuideLineInformation();
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};
});