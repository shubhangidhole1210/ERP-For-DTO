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
		
		
		var data = {

				name: $scope.product.name,
				partNumber: $scope.product.partNumber,
				clientpartnumber: $scope.product.clientpartnumber,
				description: $scope.product.description,
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
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveProductError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
							}
							else{
								$scope.displayProgressBar = false;
								utils.showToast('Product Information saved successfully.');
								$rootScope.$emit("CallPopulateProductList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveProductError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
	}
	
	$scope.submitProductInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.saveProduct($event);
			
		} else {
			console.log('its else block');
			utils.showToast('Please fill all required information');
		}

	}

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