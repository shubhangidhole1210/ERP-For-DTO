erpApp.controller('statusCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth)
{
	$rootScope.$on("callPopulateStatusList", function() {
		$scope.populateStatusList();
	});
	$rootScope.$on("saveUnitError", function() {
		$scope.showAddNewUnit();
	});
	$scope.populateStatusList=function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "status/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.statuss=response.data;
			console.log(response)
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
	$scope.status={}
	$scope.showAddNewStatus = function(ev) {
		$scope.status={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW STATUS"
		var abc = {
			controller : StatusDialogueController,
			templateUrl : 'views/statusInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				status : $scope.status,
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
	
	
	function StatusDialogueController($scope, $mdDialog,status,action,flag,$mdToast,information) {
		$scope.isReadOnly = action;
		$scope.flag = flag;
		$scope.status = status;
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

		$scope.saveStatusInformation = function(ev) {
			
			
			var data = {

					name : $scope.status.name,
			        description : $scope.status.description,
			        type : $scope.status.type,
			        isactive : true
					
			};
			var httpparams = {};
			if ($scope.flag == 0) {
				console.log($scope.status);
				console.log($scope.data);
				httpparams.method = 'post';
				httpparams.url = SERVER_URL + "status/create";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
			} else {
				console.log($scope.status);
				data.id = $scope.status.id;
				httpparams.method = 'put';
				httpparams.url = SERVER_URL + "status/update";
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
											"saveUnitError", {});
									console.log(data);
									$scope.hide();
									$scope.message = 'Something went worng. Please try again later.';
									$scope.showToast();
								}else{
									$scope.displayProgressBar = false;
									$scope.message = 'Status Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("callPopulateStatusList",{});
								}
							},
							function errorCallback(data) {
								$rootScope.$emit(
										"saveUnitError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
							});

		}

		$scope.submitStatusInformation = function(isvaliduser,$event) {
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
									$scope.saveStatusInformation(ev);
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
	
	$scope.showEditStatus = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.status = $scope.statuss[index];
		$scope.information = "EDIT STATUS INFORMATION"
		console.log($scope.status);
		$mdDialog
				.show({
					controller : StatusDialogueController,
					templateUrl : 'views/statusInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						status : $scope.status,
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
	
	$scope.viewStatusInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.status = $scope.statuss[index];
		$scope.isSaving = false;
		$scope.information = "VIEW STATUS INFORMATION"
		console.log($scope.status);
		$mdDialog.show({
					controller : StatusDialogueController,
					templateUrl : 'views/statusInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						status : $scope.status,
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
	
	$scope.deleteStatus = function(index) {
		/* $scope.user = $scope.users[index].id; */
		console.log($scope.unit);

		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "status/delete/" + $scope.statuss[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("callPopulateStatusList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		$scope.showProgressBarOne();

	};
	$scope.showConfirm = function(ev,index) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to delete Status Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteStatus(index);
							
							$scope.message = 'Delete Status sucessfully';
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