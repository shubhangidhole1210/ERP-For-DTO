erpApp.controller('qualityInspectionCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,
		SERVER_URL) {
$scope.getRMInformation=function()
	
	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorderinvoice/security-in-invoices"
		}).then(function successCallback(response) {
			$scope.invoiceList = response.data;
			

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}

$scope.invoiceRawMaterialList=function(index)
{
	$http({
		method : 'GET',
		url : SERVER_URL + "qualitycheckrawmaterial/listrm/"
		                 + $scope.invoiceList.id
	}).then(function successCallback(response) {
		$scope.rmInvoiceList = response.data;
		console.log($scope.rmInvoiceList)

		console.log(response);

	}, function errorCallback(response) {
		console.log("Error");

	});
	
	}


});
