
erpApp.controller('rmInventoryCtrl',function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils){
					$scope.isReadOnly = false;
					$scope.isrmInventoryPresent=false;
					$scope.isRmVisible = false;
					$scope.rmInventary = {};
					
					$rootScope.$on("CallPopulateRMInventaryList", function() {
						$scope.populateRMInventaryList();
					});
					
					$rootScope.$on("saveRMInventaryError", function() {
						$scope.showAddNewRMInventary();
					});
					$scope.populateRMInventaryList = function() {
						 $scope.currentPage = 0;
					     $scope.pageSize = 15;
							var httpparams = {};
							httpparams.method = 'GET';
							httpparams.url = SERVER_URL + "rawmaterialinventory/list";
							httpparams.headers = {
									auth_token : Auth.getAuthToken()
								};
							$http(httpparams).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.rmInventarys = response.data;
							$scope.isRmInventoryInformation();
							console.log(response);
							$mdDialog.hide();
						}, function errorCallback(response) {
							utils.showToast('We are Sorry. Something went wrong. Please try again later.');
							console.log("Error");
							$mdDialog.hide();
						});
					   
						utils.showProgressBar();
					};
					
					$scope.isRmInventoryInformation = function() {
						$scope.isrmInventoryPresent = $scope.data.length === 0 ? true : false;
					};
					
					$scope.showAddNewRMInventary = function(ev) {
						$scope.flag = 0;
						$scope.isReadOnly = false;
						$scope.rmInventary = {};
						$scope.isRmVisible = false;
						$scope.information = "ADD NEW RAW MATERIAL INVENTORY INFORMATION"
						var addNewRMInventory = {
							controller : 'RMInvenaryDialogeController',
							templateUrl : 'views/RMInventaryDialog.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing user dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								rmInventary : $scope.rmInventary,
								flag : $scope.flag,
								action : $scope.isReadOnly,
								information : $scope.information,
								rmAction : $scope.isRmVisible
							}
						};
						$mdDialog
						.show(addNewRMInventory)
						.then(function(answer) {},
								function() {});
					};
	

					$scope.deleteRMInventory = function(index) {
						console.log($scope.rmInventary);
						$http(
								{
									method : 'delete',
									url : SERVER_URL
											+ "rawmaterialinventory/delete/"
											+ $scope.rmInventarys[index].id

								}).then(
								function successCallback(data) {
									$mdDialog.hide();
									$rootScope.$emit(
											"CallPopulateRMInventaryList", {});
									console.log(data);
									$scope.message = 'Delete Raw Material inventory Record sucessfully';
									$scope.showToast();
								}, function errorCallback(data) {
									console.log("Error");
									utils.showToast('We are Sorry. Something went wrong. Please try again later.');
								});
						$scope.showProgressBarOne();

					};
					
					$scope.showConfirm = function(ev,index) {
						var confirm = $mdDialog.confirm().title(
								'Are you sure you want to Delete Raw Material Inventory Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');
						$mdDialog
								.show(confirm)
								.then(
										function() {
											$scope.status = 'You decided to get rid of your debt.';
											$scope.deleteRMInventory(index);
										},
										function() { });
					};

					$scope.showEditRMInventary = function(ev, index) {
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.isRmVisible = true;
						$scope.rmInventary = $scope.rmInventarys[index];
						console.log($scope.rmInventary);
						$scope.information="EDIT NEW RAW MATERIAL INVENTORY INFORMATIONn"
						$mdDialog
								.show({
									controller : 'RMInvenaryDialogeController',
									templateUrl : 'views/RMInventaryDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmInventary : $scope.rmInventary,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information,
										rmAction : $scope.isRmVisible
									}
								})
								.then(function(answer) {},
										function() {});
					};

					$scope.viewEditRMInventary = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.rmInventary = $scope.rmInventarys[index];
						$scope.isSaving = false;
						$scope.isRmVisible = true;
						$scope.information="VIEW NEW RAW MATERIAL INVENTORY INFORMATION"
						console.log($scope.rmInventary);
						$mdDialog.show({
									controller : 'RMInvenaryDialogeController',
									templateUrl : 'views/RMInventaryDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										rmInventary : $scope.rmInventary,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information,
										rmAction : $scope.isRmVisible
									}
								})
								.then(function(answer) {},
										function() {});
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