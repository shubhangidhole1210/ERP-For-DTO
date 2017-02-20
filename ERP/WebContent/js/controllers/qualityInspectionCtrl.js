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

   $scope.submitInformation=function(isvaliduser, $event)
   {
	   if (isvaliduser) {
			$scope.saveQualityinspectionInformation();
		} else {
			console.log('its else block');
	}
   }
   $scope.saveQualityinspectionInformation=function()
   {
	   console.log('its save function');
	   var data = {

			   description:$scope.description,
			   id: $scope.invoiceList.id,
			   qualitycheckrawmaterials:$scope.rmInvoiceList
			};
	   $http({
			method : 'post',
			url : SERVER_URL + "qualitycheckrawmaterial/qualitycheck",
			data : data
		}).then(function successCallback(data) {
             
			console.log(data);
		}, function errorCallback(response) {
			console.log("Error");

		});
   }

});
