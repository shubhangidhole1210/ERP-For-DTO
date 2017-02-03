erpApp.controller('unitCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast)
{
	
	$rootScope.$on("CallPopulateUnitList", function() {
		$scope.populateUnitList();
	});
	$rootScope.$on("saveUnitError", function() {
		$scope.showAddNewUnit();
	});
	$scope.populateUnitList=function()
	{
		$http({
			method : 'GET',
			url : SERVER_URL + 'unit/list'
		}).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.units=response.data;
			$scope.isUnitInformation()
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
	$scope.isUnitInPresent=false; 
	$scope.isUnitInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isUnitInPresent=true; 
			}
		else
			{
			$scope.isUnitInPresent=false; 
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
	$scope.unit={}
	$scope.showAddNewUnit = function(ev) {
		$scope.unit={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW UNIT"
		var abc = {
			controller : UnitController,
			templateUrl : 'views/unitInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				unit : $scope.unit,
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
	
	
	function UnitController($scope, $mdDialog,unit,action,flag,$mdToast,information) {
		$scope.isReadOnly = action;
		$scope.flag = flag;
		$scope.unit = unit;
		$scope.information = information;
		/*$scope.user.dob = new Date($scope.user.dob);
		$scope.user.doj = new Date($scope.user.doj);*/
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

		$scope.saveUnitInformation = function(ev) {
			
			
			var data = {

					name : $scope.unit.name,
					description : $scope.unit.description,
				     created_by : null,
				     /*created_date : null,*/
				     updated_by : null,
				     /*updated_date : null,*/
				     isactive : true
			};
			var httpparams = {};
			if ($scope.flag == 0) {
				console.log($scope.user);
				console.log($scope.data);
				httpparams.method = 'post';
				httpparams.url = SERVER_URL + "unit/create";
			} else {
				console.log($scope.unit);
				data.id = $scope.unit.id;
				httpparams.method = 'put';
				httpparams.url = SERVER_URL + "unit/update";
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
									$scope.message = 'Unit Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("CallPopulateUnitList",{});
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

		$scope.submitUnitInformation = function(isvaliduser,$event) {
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
									$scope.saveUnitInformation(ev);
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
	
	$scope.showEditUnit = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.unit = $scope.units[index];
		$scope.information = "EDIT UNIT INFORMATION"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : UnitController,
					templateUrl : 'views/unitInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						unit : $scope.unit,
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
	
	$scope.viewUnitInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.unit = $scope.units[index];
		$scope.isSaving = false;
		$scope.information = "VIEW UNIT INFORMATION"
		console.log($scope.unit);
		$mdDialog.show({
					controller : UnitController,
					templateUrl : 'views/unitInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						unit : $scope.unit,
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
	
	$scope.deleteUnit = function(index) {
		/* $scope.user = $scope.users[index].id; */
		console.log($scope.unit);

		$http(
				{
					method : 'delete',
					url : SERVER_URL + "unit/delete/"
							+ $scope.units[index].id

				}).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("CallPopulateUnitList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		$scope.showProgressBarOne();

	};
	$scope.showConfirm = function(ev,index) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete Unit Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteUnit(index);
							
							$scope.message = 'Delete unit sucessfully';
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