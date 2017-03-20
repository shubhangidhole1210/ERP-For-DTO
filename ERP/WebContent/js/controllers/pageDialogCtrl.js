erpApp.controller('pageDialogController', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils,page,action,flag,information) {
	
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

	$scope.savePageInformation = function(ev) {
		
		
		var data = {
  
				menu : $scope.page.menu,
				pageName : $scope.page.pageName,
				submenu : $scope.page.submenu,
				url : $scope.page.url,
				description : $scope.page.description
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
								utils.showToast('Something went worng. Please try again later.');
								$scope.showToast();
							}else{
								$scope.displayProgressBar = false;
								utils.showToast('Page Information saved successfully.');
								$rootScope.$emit("CallPopulatePageList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveUnitError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});

	}

	$scope.submitPageInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			$scope.savePageInformation($event)
			
		} else {
			console.log('its else block');
		}

	}

	
	
	
});