erpApp.controller('productCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,fileUpload,Auth) {
	
	$rootScope.$on("CallPopulateProductList", function() {
		$scope.populteProductList();
	});
	$rootScope.$on("saveProductError", function() {
		$scope.showAddNewProduct();
	});
	
	$scope.populteProductList=function()
	{
		/*$http({
			method : 'GET',
			url : SERVER_URL + "product/list"
		})*/
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "product/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.products = response.data;
			$scope.isProductInformation();
			console.log(response);
			$mdDialog.hide();

		}, function errorCallback(response) {
			$scope.message = "We are Sorry. Something went wrong. Please try again later."
			$scope.showToast();
			console.log("Error");
			$mdDialog.hide();

		});
		$scope.showProgressBarOne();
	}
	$scope.showProgressBarOne= function()
	{
		$mdDialog
		.show(
				{
					controller : ProgressBarController,
					templateUrl : 'views/progressBar.html',
					parent : angular
							.element(document.body),
					/*targetEvent : ev,*/
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					onComplete : function() {
					/*	$scope.populateUserList(ev);*/
					}
					
				
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
	
	$scope.isProductPresent=false;
	$scope.isProductInformation= function()
	{
		if($scope.data.length==0)
			{
			$scope.isProductPresent=true;
			}
		else
			{
			$scope.isProductPresent=false;
			}
	}
	
	
	$scope.product = {};
	$scope.showAddNewProduct = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.product = {};
		$scope.information="ADD NEW PRODUCT"
		var abc = {
			controller : ProductController,
			templateUrl : 'views/productInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				product : $scope.product,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
				.show(abc)
				.then(
						function(answer) {
							$scope.status = 'You said the information was "'
									+ answer + '".';
						},
						function() {
							$scope.status = 'You cancelled the dialog.';
						});
	};
	function ProductController($scope, $mdDialog,product,action,flag,$mdToast,information,fileUpload,Auth) {
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
		
		
	  }
	
	$scope.showEditProduct = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.information= "EDIT PRODUCT INFORMATION";
		$scope.product = $scope.products[index];
		console.log($scope.product);
		$mdDialog
				.show({
					controller : ProductController,
					templateUrl : 'views/productInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						product : $scope.product,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
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
	$scope.viewProductInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.product = $scope.products[index];
		$scope.isSaving = false;
		$scope.information="VIEW PRODUCT INFORMATION"
		console.log($scope.product);
		$mdDialog.show({
					controller : ProductController,
					templateUrl : 'views/productInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						product : $scope.product,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
					}
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
	
	
	$scope.deleteProduct = function(index) {
		console.log($scope.product);

		/*$http(
				{
					method : 'delete',
					url : SERVER_URL + "product/delete/"
							+ $scope.products[index].id

				})*/
		
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "product/delete/" + $scope.products[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("CallPopulateProductList", {});
			console.log(data);
			

		}, function errorCallback(data) {
			console.log("Error");
		});
		$scope.showProgressBarOne();

	};

	$scope.showConfirm = function(ev,index) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete Product Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteProduct(index);
							
							$scope.message = 'Delete Product Record sucessfully';
							$scope.showToast();
							
							
						},
						function() {
							$scope.status = 'You decided to keep your debt.';
						});
	};
	
	function ProgressBarController($scope, $mdDialog) {
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	}

});