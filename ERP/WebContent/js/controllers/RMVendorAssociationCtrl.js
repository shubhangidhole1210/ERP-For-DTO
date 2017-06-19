erpApp
		.controller(
				'RMVendorCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils) {
					$scope.isReadOnly = false;
					$scope.isPresentvenodrAsso=false;
					$scope.isDropDownreadOnly = false;
					 $scope.currentPage = 0;
				     $scope.pageSize = 15;
					
					$rootScope.$on("CallPopulateRMVendorAssociationList", function() {
						$scope.populateRMVendorAssociationList();
					});
					$rootScope.$on("saveRMOrderAssociationError", function() {
						$scope.showAddNewRMVendorAssociation();
					});

					$scope.populateRMVendorAssociationList = function() {
						 $scope.currentPage = 0;
					     $scope.pageSize = 15;
						utils.showProgressBar();
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL + "rmvendorasso/list";
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.rmOrderAssociations = response.data;
							$scope.isRMVendorAssociationInformation();
							console.log(response);
							utils.hideProgressBar();

						}, function errorCallback(response) {
							utils.showToast = "We are Sorry. Something went wrong. Please try again later."
							console.log("Error");
							utils.hideProgressBar();
						});
					}
		
					$scope.isRMVendorAssociationInformation = function() {
						$scope.isPresentvenodrAsso = $scope.data.length === 0 ? true : false;
					};
					
					$scope.rmOrderAssociation = {};
					$scope.showAddNewRMVendorAssociation = function(ev) {
						$scope.flag = 0;
						$scope.isReadOnly = false;
						$scope.isDropDownreadOnly = false;
						$scope.rmOrderAssociation = {};
						$scope.title="ADD RAW MATERIAL VENDOR ASSOCIATION INFORMATION"
						var addNewRMVendorAsso = {
							controller : 'RMVendorAssociationDialogCtrl',
							templateUrl : 'views/RMVendorDialog.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing user dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								rmOrderAssociation : $scope.rmOrderAssociation,
								flag : $scope.flag,
								action : $scope.isReadOnly,
								title: $scope.title,
								dropdownAction:$scope.isDropDownreadOnly
							}
						};
						$mdDialog
						.show(addNewRMVendorAsso)
						.then(function(answer) {},
								function() {});
					};
		
					$scope.deleteUser = function(index) {
						console.log($scope.user);
						$http(
								{
									method : 'delete',
									url : SERVER_URL + "rmvendorasso/delete/"
											+ $scope.rmOrderAssociations[index].id

								}).then(function successCallback(data) {
							$rootScope.$emit("CallPopulateRMVendorAssociationList", {});
							console.log(data);

						}, function errorCallback(data) {
							console.log("Error");
						});
						$scope.showProgressBarOne()
					};

					$scope.showRMVendorAssociation = function(ev, index) {
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.isDropDownreadOnly = true;
						$scope.rmOrderAssociation = $scope.rmOrderAssociations[index];
						console.log($scope.rmOrderAssociation);
						$scope.title= "EDIT RAW MATERIAL VENDOR ASSOCIATION INFORMATION"
						$mdDialog
								.show({
									controller : 'RMVendorAssociationDialogCtrl',
									templateUrl : 'views/RMVendorDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmOrderAssociation : $scope.rmOrderAssociation,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										title : $scope.title,
										dropdownAction:$scope.isDropDownreadOnly
									}
								})
								.then(function(answer) {},
										function() {});
					};

					$scope.viewRMVendorAssociation = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.isDropDownreadOnly = true;
						$scope.rmOrderAssociation = $scope.rmOrderAssociations[index];
						$scope.isSaving = false;
						$scope.title= "VIEW RAW MATERIAL VENDOR ASSOCIATION INFORMATION"
					
						$mdDialog.show({
									controller : 'RMVendorAssociationDialogCtrl',
									templateUrl : 'views/RMVendorDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmOrderAssociation : $scope.rmOrderAssociation,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										title : $scope.title,
										dropdownAction:$scope.isDropDownreadOnly
									}
								})
								.then(function(answer) {},
										function() {});
					};

					$scope.deleteRMVendorAssociation = function(index) {
						var httpparams = {};
						httpparams.method = 'delete';
						httpparams.url = SERVER_URL + "unit/delete/" + $scope.rmOrderAssociations[index].id;
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(data) {
							utils.hideProgressBar();
							$rootScope.$emit("CallPopulateRMVendorAssociationList", {});
							console.log(data);

						}, function errorCallback(data) {
							console.log("Error");

						});
						utils.showProgressBar();
					};
					
					$scope.showConfirm = function(ev,index) {
						var confirm = $mdDialog.confirm().title(
								'Are you sure you want to Delete Raw Material Vendor Association Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');
						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteRMVendorAssociation(index);
											utils.showToast('Rm Vendor Association Deleted Sucessfully!');
										
										},
										function() {
											$scope.status = 'You decided to keep your debt.';
										});
					};
					
					$scope.gotoPrevPage = function(){
						 utils.scrollToTop();
						 $scope.currentPage = $scope.currentPage - 1;
					};
					
					$scope.gotoNextPage = function(){
						 utils.scrollToTop();
						 $scope.currentPage = $scope.currentPage + 1;
					};
					
				});