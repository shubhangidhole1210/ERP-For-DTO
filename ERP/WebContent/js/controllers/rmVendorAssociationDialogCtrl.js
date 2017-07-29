erpApp.controller(
				'RMVendorAssociationDialogCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils,rmOrderAssociation,flag,action,title,dropdownAction,$timeout, $q, $log){
					$scope.isReadOnly = action;
					$scope.flag = flag;
					$scope.rmOrderAssociation = rmOrderAssociation;
					$scope.title = title;
					/*$scope.isRawMaterial = false;
					$scope.isVendor false;*/
					
					
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
								rawmaterialId:$scope.selectedRM,
								vendorId:$scope.rmOrderAssociation.vendorId.id,
								pricePerUnit:$scope.rawmaterial.pricePerUnit
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
												console.log(data);
												$scope.hide();
												utils.showToast('Something went worng. Please try again later.');
											}else if(data.data.code === 2){
												$scope.hide();
												$rootScope.$emit(
														"saveRMOrderAssociationError", {});
												utils.showToast(data.data.message);
											}
											
											else{
												console.log(data.data.message);
												$scope.displayProgressBar = false;
												utils.showToast('Raw Material Vendor Association Information saved successfully.');
												/*$rootScope.$emit(
														"saveRMOrderAssociationError", {});*/
												utils.hideProgressBar();
												$rootScope.$emit("CallPopulateRMVendorAssociationList",{});
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
								console.log("In get raw materials function $scope.rawmaterials is :",$scope.rawmaterials);
							}, function errorCallback(response) {
								console.log("Error");
							});
					    };
					    
					    
					    $scope.getPrice=function(){
					    	var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "rawmaterial/" +$scope.selectedRM.id;
							console.log("$scope.rmOrderAssociation.rawmaterialId.id :" ,$scope.selectedRM.id);
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
								$scope.rawmaterial = response.data;
								console.log("In get raw materials function $scope.rawmaterials is(price function) :",$scope.rawmaterial);
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
					   
					   $scope.simulateQuery = false;
					    $scope.isDisabled    = false;
					   
					
});