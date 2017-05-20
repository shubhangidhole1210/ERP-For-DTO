erpApp
		.controller(
				'qualityInspectionCtrl',
				function($scope, $http, $mdDialog, $mdToast, $rootScope,
						SERVER_URL, utils, Auth, $location) {
					document.getElementById('invoiceNumber').focus();
					$scope.getRMOrderInvoiceInformation = function()

					{
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "rawmaterialorderinvoice/security-in-invoices";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.invoiceList = response.data;
									console.log(response);
									utils.hideProgressBar();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
						utils.showProgressBar();
					};

					$scope.invoiceRawMaterialList = function(index) {
						var httpparams = {};
						httpparams.method = 'GET';
						httpparams.url = SERVER_URL
								+ "qualitycheckrawmaterial/listrm/"
								+ $scope.invoiceList.id;
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						$http(httpparams).then(
								function successCallback(response) {
									$scope.rmInvoiceList = response.data;
									console.log($scope.rmInvoiceList)
									console.log(response);
									utils.hideProgressBar();
								}, function errorCallback(response) {
									console.log("Error");
									utils.hideProgressBar();
								});
						utils.showProgressBar();
					};

					$scope.submitInformation = function(isvaliduser, $event) {
						if (isvaliduser) {
							$scope.saveQualityinspectionInformation();
						} else {
							console.log('its else block');
							utils.showToast('Please fill all required information');
						}
					};

					$scope.resetQualityInspection = function() {
						$location.path('/');
					};

					$scope.saveQualityinspectionInformation = function() {
						console.log('its save function');
						var index = 0;
						for (index = 0; index < $scope.rmInvoiceList.length; index++) {
							$scope.rmInvoiceList[index].intakeQuantity = $scope.rmInvoiceList[index].quantity;
						}
						var data = {

							description : $scope.description,
							id : $scope.invoiceList.id,
							qualitycheckrawmaterials : $scope.rmInvoiceList

						};

						var httpparams = {};
						httpparams.method = 'post';
						httpparams.url = SERVER_URL
								+ "qualitycheckrawmaterial/qualitycheck";
						httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
						httpparams.data = data;
						$http(httpparams)
								.then(
										function successCallback(data) {
											if (data.data.code === 1) {
												console.log(data.data.message);
												console.log(data);
												$location.path('/')
												utils
														.showToast('Qualitycheckrawmaterial added Successfully !')
												utils.hideProgressBar();
											} else {
												console.log(data);
												utils
														.showToast('something went wrong please try again')
												utils.hideProgressBar();
											}

										},
										function errorCallback(response) {
											console.log("Error");
											utils.hideProgressBar();
											utils
													.showToast('something went wrong please try again')
										});
						utils.showProgressBar();
					};
					$scope.ischeckBoxDisabled = true;

					$scope.checkReceivedQuantity = function(index) {

						console.log('checkReceivedQuantity');
						
						if ($scope.rmInvoiceList[index].quantity === parseInt($scope.rmInvoiceList[index].goodQuantity)) {
							$scope.rmInvoiceList[index].isReturnInvoiceInitated = false;
							$scope.rmInvoiceList[index].ischeckBoxDisabled = true;
						} else if ($scope.rmInvoiceList[index].quantity <= parseInt($scope.rmInvoiceList[index].goodQuantity)) {
							$scope.rmInvoiceList[index].isReturnInvoiceInitated = false;
							$scope.rmInvoiceList[index].ischeckBoxDisabled = true;
						}else if ($scope.rmInvoiceList[index].goodQuantity > 0){
							$scope.rmInvoiceList[index].isReturnInvoiceInitated = true;
							$scope.rmInvoiceList[index].ischeckBoxDisabled = false;
						}
						
						else {
							$scope.rmInvoiceList[index].isReturnInvoiceInitated = true;
							$scope.rmInvoiceList[index].ischeckBoxDisabled = false;

						}
						

					};

				});
