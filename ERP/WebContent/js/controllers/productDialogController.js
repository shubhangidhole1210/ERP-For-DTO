erpApp.controller('productDialogCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,product,action,flag,information){
	$scope.isReadOnly = action;
	$scope.flag = flag;
	$scope.product = product;
	$scope.information=information;
	
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

	$scope.saveProduct = function(ev) {
	/*	utils.showProgressBar();*/
		var data = {
				name: $scope.product.name,
				partNumber: $scope.product.partNumber,
				clientPartNumber: $scope.product.clientPartNumber,
				description: $scope.product.description,
				//minQuantity: $scope.product.minQuantity,
				//maxQuantity: $scope.product.maxQuantity,
				design: 'Design will be added later on'
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.product);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "product/create";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			console.log($scope.product);
			data.id = $scope.product.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "product/update";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		}
		httpparams.data = data;
		$http(httpparams)
				.then(
						function successCallback(data) {
							$mdDialog.hide();
							utils.hideProgressBar('parent');
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveProductError", {});
								console.log(data);
								$scope.hide();
								utils.showToast(data.data.message);
							}
							else{
								//utils.hideProgressBar();
								$scope.displayProgressBar = false;
								utils.showToast(data.data.message);
								$rootScope.$emit("CallPopulateProductList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveProductError", {});
							console.log(data);
							utils.showToast('Something went worng. Please try again later.');
						});
	};
	
	$scope.submitProductInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveProduct($event);
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}
	};

	var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            formdata.append('file', value);
            console.log($files);
            console.log(formdata);
        });
    };

    $scope.uploadFiles = function () {
    	var httpparams = {};
    	httpparams.method = 'post';
    	httpparams.url = SERVER_URL + "fileupload";
    	httpparams.data = formdata;
    	httpparams.headers = {
    			"Content-Type" : undefined,
				auth_token : Auth.getAuthToken()
			};
    	httpparams.transformRequest = angular.identity;
    	httpparams.withCredentials = false;
    	$http(httpparams)
		.then(
				function successCallback(response) {
					console.log(response);
				},
				function errorCallback(response) {
					console.log(error)
				});
    }
});