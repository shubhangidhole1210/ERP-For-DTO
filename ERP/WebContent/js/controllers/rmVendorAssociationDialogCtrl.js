erpApp
		.controller(
				'RMVendorAssociationDialogCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,rmOrderAssociation,flag,action,title,dropdownAction){
					$scope.isReadOnly = action;
					$scope.flag = flag;
					$scope.rmOrderAssociation = rmOrderAssociation;
					$scope.title = title;
					$scope.isDropDownreadOnly = dropdownAction;
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

					$scope.saveRMOrderAssociation = function() {
						var data = {
								rawmaterial:$scope.rmOrderAssociation.rawmaterial.id,
								vendor:$scope.rmOrderAssociation.vendor.id,
								pricePerUnit:$scope.rmOrderAssociation.pricePerUnit
						};
						var httpparams = {};
						if ($scope.flag == 0) {
							console.log($scope.rmOrderAssociation);
							console.log($scope.data);
							httpparams.method = 'post';
							httpparams.url = SERVER_URL + "rmvendorasso/create";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
						} else {
							console.log($scope.rmOrderAssociation);
							data.id = $scope.rmOrderAssociation.id;
							httpparams.method = 'put';
							httpparams.url = SERVER_URL + "rmvendorasso/update";
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
														"saveRMOrderAssociationError", {});
												console.log(data);
												$scope.hide();
												utils.showToast('Something went worng. Please try again later.');
											}else if(data.data.code === 2){
												$rootScope.$emit(
														"saveRMOrderAssociationError", {});
												$scope.hide();
												utils.showToast(data.data.message);
											}
											
											else{
												console.log(data.data.message);
												$scope.displayProgressBar = false;
												utils.showToast('Raw Material Vendor Association Information saved successfully.');
												$rootScope.$emit("CallPopulateRMVendorAssociationList",{});
												utils.hideProgressBar();
											}
										},
										function errorCallback(data) {
											$rootScope.$emit(
													"saveRMOrderAssociationError", {});
											console.log(data);
											$scope.hide();
											utils.showToast('Something went worng. Please try again later.');
										});
					};

					$scope.submitRMVendorAssociationInformation = function(isvaliduser,$event) {
						if (isvaliduser) {
							$scope.saveRMOrderAssociation();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};
					
					    $scope.getRawMaterials=function(){
					    	var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "rawmaterial/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.rawmaterials = response.data;
								console.log(response);
							}, function errorCallback(response) {
								console.log("Error");
							});
					    };
				
					   $scope.getVendors=function(){
						   var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "vendor/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.venodrs = response.data;
								console.log(response);
							}, function errorCallback(response) {
								console.log("Error");
							});
					   };
});