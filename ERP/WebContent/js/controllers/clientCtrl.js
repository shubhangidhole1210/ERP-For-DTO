erpApp
		.controller(
				'clientCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils) {
					$scope.isReadOnly = false;
					$scope.isClientPresent=false;
					$scope.client = {};
					
					$rootScope.$on("CallPopulateClientList", function() {
						$scope.populateClientList();
					});
					$rootScope.$on("saveClientError", function() {
						$scope.showAddNewClient();
					});

					$scope.populateClientList = function() {
						utils.showProgressBar();
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL + "client/list";
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(function successCallback(response) {
							$scope.data = response.data;
							$scope.clients = response.data;
							$scope.isClientInfirmation();
							console.log(response);
							utils.hideProgressBar();

						}, function errorCallback(response) {
							utils.showToast("We are Sorry. Something went wrong. Please try again later.");
							console.log("Error");
							utils.hideProgressBar();
						});
					};
					
					$scope.isClientInfirmation = function() {
						$scope.isClientPresent = $scope.data.length === 0 ? true : false;
					};
				
					$scope.showAddNewClient = function(ev) {
						$scope.client = {};
						$scope.information="ADD NEW CLIENT"
						$scope.flag = 0;
						$scope.isReadOnly = false;
						var addNewClientDialog = {
							controller : 'clientDialogCtrl',
							templateUrl : 'views/clientDialog.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							onRemoving : function(){console.log('Removing user dialog');},
							fullscreen : $scope.customFullscreen,
							locals : {
								client : $scope.client,
								flag : $scope.flag,
								action : $scope.isReadOnly,
								information : $scope.information
							}
						};
						$mdDialog
						.show(addNewClientDialog)
						.then(function(answer) {},
								function() {});
					};
		   
					$scope.deleteClient = function(index) {
						console.log($scope.client);
						var httpparams = {};
						httpparams.method = 'delete';
						httpparams.url = SERVER_URL + "client/delete/" + + $scope.clients[index].id;
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(data) {
							utils.hideProgressBar();
							$rootScope.$emit("CallPopulateClientList", {});
							utils.showToast('Client Deleted Sucessfully!');
						}, function errorCallback(data) {
							console.log("Error");
							utils.showToast("We are Sorry. Something went wrong. Please try again later.");
						});
						utils.showProgressBar();
					};

					$scope.showEditClient = function(ev, index) {
						$scope.information ="EDIT CLIENT INFORMATION"
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.client = $scope.clients[index];
						console.log($scope.client);
						$mdDialog
								.show({
									controller : 'clientDialogCtrl',
									templateUrl : 'views/clientDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										client : $scope.client,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information
									}
								})
								.then(function(answer) {},
										function() {});
					};

					$scope.viewClientInformation = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.client = $scope.clients[index];
						$scope.isSaving = false;
						$scope.information ="VIEW CLIENT INFORMATION"
						console.log($scope.user);
						$mdDialog.show({
									controller : 'clientDialogCtrl',
									templateUrl : 'views/clientDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										client : $scope.client,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information
									}
								})
								.then(function(answer) {},
										function() {});
					};

					$scope.showConfirm = function(ev,index) {
						var confirm = $mdDialog.confirm().title(
								'Are you sure you want to Delete Client Information?')
								.ariaLabel('Lucky day').targetEvent(ev).ok(
										'YES' ).cancel('NO');
						$mdDialog.show(confirm).then(
										function() {
											$scope.deleteClient(index);
										},
										function() { });
					};
				});