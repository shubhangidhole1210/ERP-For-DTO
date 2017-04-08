erpApp
		.controller(
				'todaysPlanCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, Auth, utils, $location) {

					$scope.currentDate = utils.getCurrentDate();
					$scope.getProducts = function() {
						utils.showProgressBar();
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "productionplanning/getProductionPlanListByDate/"
								+ $scope.currentDate;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};

						$http(httpparams).then(
								function successCallback(response) {
									utils.hideProgressBar();
									$scope.productList = response.data;
//									$scope.isTodaysProductionPlan();
									console.log(response);
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
					};

				/*	$scope.isTodaysProductionPlanPresent = false;
					$scope.isTodaysProductionPlan = function() {
						if ($scope.data.length == 0) {
							$scope.isTodaysProductionPlanPresent = true;
						} else {
							$scope.isTodaysProductionPlanPresent = false;
						}
					}*/

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveTodaysProductionPlan();
						} else {
							console.log('its else block');
						}
					};
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
					}

				});