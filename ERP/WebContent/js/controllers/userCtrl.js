erpApp.controller('userCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, utils, Auth) {
					$scope.isReadOnly = false;
					$scope.isUserUnavailable = false;
					$scope.user = {};
					
					$rootScope.$on("CallPopulateUserList", function($event) {
						$scope.populateUserList();
					});
					$rootScope.$on("saveUserError", function() {
						$scope.showAddNewUser();
					});

					$scope.populateUserList = function() {
						 $scope.currentPage = 0;
					     $scope.pageSize = 15;
						utils.showProgressBar();
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL + "user/list";
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(response) {
											$scope.data = response.data;
											$scope.users = response.data;
											$scope.isUserInformation();
											console.log(response);
											utils.hideProgressBar();
										},
										function errorCallback(response) {
											$scope.message = 
											utils.showToast("We are Sorry. Something went wrong. Please try again later.");
											console.log("Error",response);
											utils.hideProgressBar();
										});
					};

					$scope.isUserInformation = function() {
						$scope.isUserUnavailable = $scope.data.length === 0 ? true : false;
					};

					$scope.showAddNewUser = function(ev) {
						$scope.user = {};
						$scope.information = "ADD NEW USER"
						$scope.flag = 0;
						$scope.isReadOnly = false;
						var addNewUserDialog = {
								
							controller : 'userDialogCtrl',
							templateUrl : 'views/userDialog.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							clickOutsideToClose : true,
							fullscreen : $scope.customFullscreen,
							locals : {
								user : $scope.user,
								flag : $scope.flag,
								action : $scope.isReadOnly,
								information : $scope.information
							}
						};
						$mdDialog
						.show(addNewUserDialog)
						.then(function(answer) {},
								function() {});
					};
					  
					$scope.showEditUser = function(ev, index) {
						$scope.flag = 1;
						$scope.isReadOnly = false;
						$scope.user = $scope.users[index];
						$scope.information = "EDIT USER INFORMATION"
						console.log($scope.user);
						$mdDialog
								.show({
									controller : 'userDialogCtrl',
									templateUrl : 'views/userDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										user : $scope.user,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information
									}
								})
								.then(function(answer) {},
										function() {});
					};
					
					$scope.viewUserInformation = function(ev, index) {
						$scope.flag = 2;
						$scope.isReadOnly = true;
						$scope.user = $scope.users[index];
						$scope.isSaving = false;
						$scope.information = "VIEW USER INFORMATION"
						console.log($scope.unit);
						$mdDialog.show({
									controller : 'userDialogCtrl',
									templateUrl : 'views/userDialog.html',
									parent : angular.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : true,
									fullscreen : $scope.customFullscreen,
									locals : {
										user : $scope.user,
										flag : $scope.flag,
										action : $scope.isReadOnly,
										information : $scope.information
									}
								})
								.then(
										function(answer) {},
										function() {});
					};
					
					$scope.deleteUser = function(index) {
						console.log($scope.user);
						var httpparams = {};
						httpparams.method = 'delete';
						httpparams.url = SERVER_URL + "user/delete/" + $scope.users[index].id;
						httpparams.headers = {
								auth_token : Auth.getAuthToken()
							};
						$http(httpparams).then(function successCallback(data) {
							    utils.hideProgressBar();
								$rootScope.$emit("CallPopulateUserList", {});
								console.log(data);
								utils.showToast('User Deleted Sucessfully!');
								}, function errorCallback(data) {
									console.log("Error");
									utils.showToast('We are Sorry. Something went wrong. Please try again later.');
						});
						utils.showProgressBar();
					};

					$scope.showConfirm = function(ev, index) {
						var confirm = $mdDialog.confirm()
								.title('Are you sure you want to Delete User Information?')
								.targetEvent(ev).ok('YES').cancel('NO');

						$mdDialog.show(confirm)
								.then(function() {
											$scope.deleteUser(index);
											/*utils.showToast('User Deleted Sucessfully!');*/
										},
										function() { });
					};
});
