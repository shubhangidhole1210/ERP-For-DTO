erpApp.controller('pageCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth) {

	$rootScope.$on("CallPopulatePageList", function() {
		$scope.populatePageList();
	});
	$rootScope.$on("saveUnitError", function() {
		$scope.showAddNewPage();
	});
	$scope.populatePageList=function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "page/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.pages=response.data;
			console.log(response)
			$mdDialog.hide();
		}, function errorCallback(response) {
			$scope.message = "We are Sorry. Something went wrong. Please try again later."
			$scope.showToast();
			console.log("Error");
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
	$scope.page={}
	$scope.showAddNewPage = function(ev) {
		$scope.page={};
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information = "ADD NEW PAGE"
		var abc = {
			controller : UnitController,
			templateUrl : 'views/pageInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				page : $scope.page,
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
	
	
	function UnitController($scope, $mdDialog,page,action,flag,$mdToast,information) {
		$scope.isReadOnly = action;
		$scope.flag = flag;
		$scope.page = page;
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

		$scope.saveUnitInformation = function(ev) {
			
			
			var data = {
      
					menu : $scope.page.menu,
					pageName : $scope.page.pageName,
					submenu : $scope.page.submenu,
					url : $scope.page.url,
					description : $scope.page.description,
				    isactive : true
			};
			var httpparams = {};
			if ($scope.flag == 0) {
				console.log($scope.user);
				console.log($scope.data);
				httpparams.method = 'post';
				httpparams.url = SERVER_URL + "page/create";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
			} else {
				console.log($scope.unit);
				data.id = $scope.page.id;
				httpparams.method = 'put';
				httpparams.url = SERVER_URL + "page/update";
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
									$scope.message = 'Page Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("CallPopulatePageList",{});
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

		$scope.submitPageInformation = function(isvaliduser,$event) {
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
	
	$scope.showEditPage = function(ev, index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.page = $scope.pages[index];
		$scope.information = "EDIT PAGE INFORMATION"
		console.log($scope.user);
		$mdDialog
				.show({
					controller : UnitController,
					templateUrl : 'views/pageInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						page : $scope.page,
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
	
	$scope.viewPageInformation = function(ev, index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.page = $scope.pages[index];
		$scope.isSaving = false;
		$scope.information = "VIEW PAGE INFORMATION"
		console.log($scope.unit);
		$mdDialog.show({
					controller : UnitController,
					templateUrl : 'views/pageInformation.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true,
					fullscreen : $scope.customFullscreen,
					locals : {
						page : $scope.page,
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
	
	$scope.deletePage = function(index) {
		 $scope.page = $scope.pages[index].id; 
		console.log($scope.page);

	
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "page/delete/" + $scope.pages[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("CallPopulatePageList", {});
			console.log(data);

		}, function errorCallback(data) {
			console.log("Error");

		});
		$scope.showProgressBarOne();

	};
	$scope.showConfirm = function(ev,index) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete page Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');

		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deletePage(index);
							$scope.message = 'Delete page sucessfully';
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
