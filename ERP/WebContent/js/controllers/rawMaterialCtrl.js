erpApp.controller('rawMaterialCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth) {
	
	$rootScope.$on("CallPopulateRawMaterial", function() {
		$scope.populateRawMaterial();
	});
	$rootScope.$on("saveRawmaterialError", function() {
		$scope.showAddRawMaterial();
	});
	
	$scope.populateRawMaterial=function()
{
		/*$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterial/list"
		})*/
		
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
	$scope.isRmPresent=false;
	$scope.getRawMaterialInformation=function()
	{
		if($scope.data.length==0)
		{
			$scope.isRmPresent=true;
		}
		else
			{
				$scope.isRmPresent=false;
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
	$scope.rawMaterial = {};
	$scope.showAddRawMaterial = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		/*$scope.rawMaterial = {};*/
		$scope.information="ADD RAW MATERIAL INFORMATION"
		var abc = {
			controller : rawMaterialController,
			templateUrl : 'views/rawMaterialInformation.html',
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
	
	function rawMaterialController($scope, $mdDialog, rawMaterial,
			$location, $rootScope,SERVER_URL,flag,action,information) {
		$scope.isReadOnly = action;
		$scope.flag = flag;
		$scope.rawMaterial = rawMaterial;
		$scope.information= information;
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

		$scope.saveRawMaterial = function(ev) {
			
			
			var data = {

					name:$scope.rawMaterial.name,
					description:$scope.rawMaterial.description,
					partNumber:$scope.rawMaterial.partNumber,
					unit:$scope.rawMaterial.unit.id,
					pricePerUnit:$scope.rawMaterial.pricePerUnit,
					createdBy: 2,
					created_date:  null,
					updatedBy:3,
					updated_date: null,
					isactive:true
			};
			var httpparams = {};
			if ($scope.flag == 0) {
				console.log($scope.user);
				console.log($scope.data);
				httpparams.method = 'post';
				httpparams.url = SERVER_URL + "rawmaterial/create";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
			} else {
				console.log($scope.rawMaterial);
				data.id = $scope.rawMaterial.id;
				httpparams.method = 'put';
				httpparams.url = SERVER_URL + "rawmaterial/update";
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
											"saveRawmaterialError", {});
									console.log(data);
									$scope.hide();
									$scope.message = 'Something went worng. Please try again later.';
									$scope.showToast();
								}else{
									$scope.displayProgressBar = false;
									$scope.message = 'Raw material Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("CallPopulateRawMaterial",{});
								}
							},
							function errorCallback(data) {
								$rootScope.$emit(
										"saveRawmaterialError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							});

		}

		$scope.submitRMInformation = function(isvaliduser,$event) {
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
									$scope.saveRawMaterial(ev);
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
		
		$scope.getUnitList= function()
		{
			/*$http({
				method : 'GET',
				url : SERVER_URL + "unit/list"
			})*/
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "unit/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			
			$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
			

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			});
		}
	
	
		
		
		
	  }
	$scope.showEditRM = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.rawMaterial = $scope.rawMaterials[index];
		console.log($scope.user);
		$scope.information = "EDIT RAW MATERIAL INFORMATION"
		$mdDialog
				.show({
					controller : rawMaterialController,
					templateUrl : 'views/rawMaterialInformation.html',
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
				.then(
						function(answer) {
							$scope.status = 'You said the information was "'
									+ answer + '".';
						},
						function() {
							$scope.status = 'You cancelled the dialog.';
						});
	};
	$scope.viewRMInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.rawMaterial = $scope.rawMaterials[index];
		$scope.isSaving = false;
		console.log($scope.rawMaterial);
		$scope.information="VIEW RAW MATERIAL INFORMATION"
		$mdDialog.show({
					controller : rawMaterialController,
					templateUrl : 'views/rawMaterialInformation.html',
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
				.then(
						function(answer) {
							$scope.status = 'You said the information was "'
									+ answer + '".';
						},
						function() {
							$scope.status = 'You cancelled the dialog.';
						});
	};
	
	
	$scope.deleteraeMaterial= function(index) {
		/* $scope.user = $scope.users[index].id; */
		console.log($scope.rawmaterial);

		/*$http(
				{
					method : 'delete',
					url : SERVER_URL + "rawmaterial/delete/"
							+ $scope.rawMaterials[index].id

				})*/
		
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "rawmaterial/delete/" + $scope.rawMaterials[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("CallPopulateRawMaterial", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		$scope.showProgressBarOne();
	};
	
	$scope.showConfirm = function(ev,index) {
		// Appending dialog to document.body to cover sidenav in docs app
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
							
							$scope.message = 'Delete Raw material Record sucessfully';
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
