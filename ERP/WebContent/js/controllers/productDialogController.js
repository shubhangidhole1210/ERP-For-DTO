erpApp.controller('productDialogCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,fileUpload,Auth,utils,product,action,flag,information,fileUpload){
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
				design: 'Design will be added later on',
				"createdBy": 2,
				"created_date":  null,
				"updatedBy":3,
				"updated_date": null,
				"isactive":true
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
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							}
							else if(data.data.code === 2)
								{
								console.log(data.data.message);
								$rootScope.$emit(
										"saveProductError", {});
								console.log(data);
								$scope.hide();
								/*$scope.message = 'Product  Name already Exist.';*/
								$scope.message=data.data.message;
								$scope.showToast();
								}
							
							else
							{
								$scope.displayProgressBar = false;
								$scope.message = 'Product Information saved successfully.';
								$scope.showToast();
								$rootScope.$emit("CallPopulateProductList",{});
								
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveProductError", {});
							console.log(data);
							$scope.hide();
							$scope.message = 'Something went worng. Please try again later.';
							$scope.showToast();
						});

	}
	  $scope.uploadFile = function(){
	        var file = $scope.myFile;
	        console.log('file is ' );
	        console.dir(file);
	        var uploadUrl = "/fileUpload";
	        fileUpload.uploadFileToUrl(file, uploadUrl);
	    };

	$scope.submitProductInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.showProgressBar($event);
			
		} else {
			console.log('its else block');
		}

	}

	$scope.showToast = function() {
		$mdToast.show({
			hideDelay : 3000,
			position : 'top right',
			controller : 'ToastCtrl',
			templateUrl : 'views/toast.html',
			locals : {
				message : $scope.message
			}
		});
	};
	
	$scope.showProgressBar = function(ev) {
		$scope.displayProgressBar = true;
		$mdDialog
				.show(
						{
							controller : ProgressBarController,
							templateUrl : 'views/progressBar.html',
							parent : angular
									.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : false,
							fullscreen : $scope.customFullscreen,
							onComplete : function() {
								$scope.saveProduct(ev);
							}
							
						// Only for -xs, -sm breakpoints.
						})
				.then(
						function(answer) {
							$scope.status = 'You said the information was "'
									+ answer + '".';
						},
						function() {
							$scope.status = 'You cancelled the dialog.';
						});
	};
});