erpApp
		.controller(
				'todaysPlanCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, Auth, utils, $location) {
					
					$scope.isTodaysProductionPlanPresent=false;
					$scope.isButton = false;
					$scope.currentDate = utils.getCurrentDate();
					
					$scope.getProducts = function() {
						utils.showProgressBar();
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "productionplanning/getProductionPlanReadyListByDate/"
								+ $scope.currentDate;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									utils.hideProgressBar();
									$scope.productList = response.data;
									console.log(response);
									$scope.isProductionPlanInformation();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
					};

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveTodaysProductionPlan();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};
					
					$scope.isProductionPlanInformation = function(){
						$scope.isTodaysProductionPlanPresent = $scope.productList.length === 0 ? true : false;
						$scope.isButton = $scope.productList.length === 0 ? false : true;
						console.log("$scope.productList: " ,$scope.productList);
					}
					
					$scope.saveTodaysProductionPlan = function() {
						var index = 0;
						var productinPlanCurrentDateLists = [];
						for (index = 0; index < $scope.productList.length; index++) {
							var product = {};
							product.productId = $scope.productList[index].product.id;
							product.targetQuantity = $scope.productList[index].targetQuantity;
							product.achivedQuantity = $scope.productList[index].achived;
							product.remark = $scope.productList[index].remark;
							product.productionPlanId = $scope.productList[index].id;
							productinPlanCurrentDateLists.push(product);
						}
						var data = {
							createDate : $scope.currentDate,
							productinPlanCurrentDateLists : productinPlanCurrentDateLists
						};
						var httpparams = {
							method : 'post',
							url : SERVER_URL
									+ "dailyproduction/dailyproductionSave",
							data : data
						};
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams)
								.then(
										function successCallback(data) {
											console.log(data.data.message);
											console.log(data);
											if (data.data.code === 1) {
												utils
														.showToast("Todays production Plan Update sucessfully!");
												$location.path('/');
											} else {
												utils
														.showToast("Something went wrong. Please try again later.");
											}
											utils.hideProgressBar();
										},
										function errorCallback(response) {
											console.log("Error");
											utils
													.showToast("Something went wrong. Please try again later.");
											utils.hideProgressBar();
										});
						utils.showProgressBar();
					};
					
					$scope.cancelTodaysProductionPlan=function(){
						$location.path('/');
					};
				});