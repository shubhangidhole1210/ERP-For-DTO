erpApp.controller('rmOrderCtrl', function($scope,$http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth) {
	
	$scope.isReadOnly = false;
	/*
	 * $http.get("userList.json") .then(function(response) {
	 * $scope.data = response.data; $scope.users =
	 * response.data.data; console.log(response); });
	 */

	$rootScope.$on("CallPopulateRMOrderList", function() {
		$scope.populateRMOrderList();
	});
	$rootScope.$on("saveRMOrderError", function() {
		$scope.showAddNewRMOrder();
	});

	$scope.populateRMOrderList = function() {
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterialorder/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		/*$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorder/list"
		})*/
		
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.rmOrders = response.data;
			$scope.isRMOrderInformation();
			$mdDialog.hide();
			console.log(response);

		}, function errorCallback(response) {
			$scope.message = "We are Sorry. Something went wrong. Please try again later."
			$scope.showToast();
			console.log("Error");
			$mdDialog.hide();
		});
		$scope.showProgressBarOne();
	}
	
	$scope.isRMOrderPresent=false;
	$scope.isRMOrderInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isRMOrderPresent=true;
			}
		else
			{
			$scope.isRMOrderPresent=false;
			}
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
	
	$scope.rmOrder = {};
	$scope.showAddNewRMOrder = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.rmOrder = {};
		$scope.title= "ADD RAW MATERIAL INFORMATION";
		var abc = {
			controller : RMOrderController,
			templateUrl : 'views/RMOorderInfo.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				rmOrder : $scope.rmOrder,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				title : $scope.title
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
	
	$scope.showRMOrder = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.rmOrder = $scope.rmOrders[index];
		console.log($scope.rmOrder);
		$scope.title="EDIT RAW MATERIAL INFORMATION"
		$mdDialog
				.show({
					controller : RMOrderController,
					templateUrl : 'views/RMOorderInfo.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						rmOrder : $scope.rmOrder,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						title : $scope.title
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
	
	$scope.viewRmOrder = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.rmOrder = $scope.rmOrders[index];
		$scope.isSaving = false;
		$scope.title = "VIEW RAW MATERIAL INFORMATION"
		console.log($scope.rmOrder);
		$mdDialog.show({
					controller : RMOrderController,
					templateUrl : 'views/RMOorderInfo.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						rmOrder : $scope.rmOrder,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						title : $scope.title
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

	
	
	
	
	

	function RMOrderController($scope, $mdDialog, rmOrder,
			$location, $rootScope,SERVER_URL,flag,action,title) {
		$scope.isReadOnly = action;
		$scope.flag = flag;
		$scope.rmOrder = rmOrder;
		$scope.title = title;
		$scope.rmOrder.expectedDeliveryDate = new Date($scope.rmOrder.expectedDeliveryDate);
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

		$scope.saveRMOrder = function(ev) {
			
			
			var data = {
					/*rawmaterial: $scope.rmOrder.rawmaterial.id,*/
					rawmaterialorderassociations:$scope.orderRawMaterials,
					name:$scope.rmOrder.name,
					description:$scope.rmOrder.description,
					status:$scope.rmOrder.status.id,
					quantity:$scope.rmOrder.quantity,
					expectedDeliveryDate:$scope.rmOrder.expectedDeliveryDate,
					vendor:$scope.rmOrder.vendor.id,
					totalprice:$scope.rmOrder.totalprice,
					tax:$scope.rmOrder.tax,
					otherCharges:$scope.rmOrder.otherCharges,
					actualPrice:$scope.rmOrder.actualPrice,
					createdBy: 2,
					created_date:  null,
					updatedBy: 3,
					updated_date: null,
					isactive:true

				
			};
			var httpparams = {};
			if ($scope.flag == 0) {
				console.log($scope.rmOrder);
				console.log($scope.data);
				/*httpparams.method = 'post';
				httpparams.url = SERVER_URL + "rawmaterialorder/createmultiple";*/
				httpparams.method = 'post';
				httpparams.url = SERVER_URL + "rawmaterialorder/createmultiple";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
			} else {
				console.log($scope.rmOrder);
				data.id = $scope.rmOrder.id;
				/*httpparams.method = 'put';
				httpparams.url = SERVER_URL + "rawmaterialorder/update";*/
				httpparams.method = 'put';
				httpparams.url = SERVER_URL + "rawmaterialorder/update";
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
											"saveRMOrderError", {});
									console.log(data);
									$scope.hide();
									$scope.message = 'Something went worng. Please try again later.';
									$scope.showToast();
								}else{
									$scope.displayProgressBar = false;
									$scope.message = 'User Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("CallPopulateRMOrderList",{});
								}
							},
							function errorCallback(data) {
								$rootScope.$emit(
										"saveRMOrderError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							});

		}

		$scope.submitRMOrderInformation = function(isvaliduser,$event) {
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
									$scope.saveRMOrder(ev);
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
		
		$scope.displayStatusId=function()
		{
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "status/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			/*$http({
				method : 'GET',
				url : SERVER_URL + "status/list"
			})*/
			
			$http(httpparams).then(function successCallback(response) {
				$scope.statusData = response.data;

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			})
		};
		
		$scope.rawMaterialId=function()
		{
			
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "rawmaterial/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			
			/*$http({
				method : 'GET',
				url : SERVER_URL + "rawmaterial/list"
			})*/
			$http(httpparams).then(function successCallback(response) {
				$scope.RMData = response.data;

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			})
			
		};
		
		$scope.displayVendorId=function()
		{
			var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "vendor/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			
			/*$http({
				method : 'GET',
				url : SERVER_URL + "vendor/list"
			})*/
			
			$http(httpparams).then(function successCallback(response) {
				$scope.vendorData = response.data;

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			})
		};
		
		
		 $scope.orderRawMaterials=[];
		    $scope.orderRawMaterial={isActive : true};
		    $scope.addOrderRawMaterial=function(){
		    	if(!angular.equals($scope.orderRawMaterial,{})){
					   $scope.orderRawMaterials.push($scope.orderRawMaterial);	
					   $scope.orderRawMaterial = {isActive : true};
					   console.log($scope.orderRawMaterials);
				}
		    };
		
		

	};

	$scope.deleteRmOrder = function(index) {
		/* $scope.user = $scope.users[index].id; */
		/*console.log($scope.user);*/

	/*	$http(
				{
					method : 'delete',
					url : SERVER_URL + "rawmaterialorder/delete/"
							+ $scope.rmOrders[index].id

				})*/
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "rawmaterialorder/delete/" +  $scope.rmOrders[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("CallPopulateRMOrderList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		$scope.showProgressBarOne();

	};

	$scope.showConfirm = function(ev,index) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title(
				'Would you like to delete user informaton?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'Delete' ).cancel('Cancel');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteRmOrder(index);
							
							$scope.message = 'Delete Record sucessfully';
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
