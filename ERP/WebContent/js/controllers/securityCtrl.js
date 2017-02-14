erpApp.controller('securityCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL) {

	$scope.getRMInformation = function()

	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorder/list"
		}).then(function successCallback(response) {
			$scope.rawMaterialOrders = response.data;
			$scope.rawMaterials = response.data;
			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}

	$scope.displayStatusId=function()
	{
		$http({
			method : 'GET',
			url : SERVER_URL + "status/list"
		}).then(function successCallback(response) {
			
			$scope.statusData = response.data;
			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}
	
	$scope.displayRMList = function(index) {
		console.log($scope.rawMaterials)
		$http({
				method : 'GET',
				url : SERVER_URL + "rawmaterial/getRMForRMOrder/"+ $scope.rawMaterialOrders.id
				//url : SERVER_URL + "rawmaterial/getRMForRMOrder/"+ $scope.rawmaterialorderassociation.id
				}).then(function successCallback(response) {
			$scope.rawMaterialList = response.data;

			console.log(response);
             console.log($scope.rawMaterialList)
		}, function errorCallback(response) {
			console.log("Error");

		});
	}
	
	$scope.displayStatusInformationList = function(index)
	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorderinvoice/liststatus/"+ $scope.rawmaterialorderinvoice.id
			//url : SERVER_URL + "rawmaterial/getRMForRMOrder/"+ $scope.rawmaterialorderassociation.id
			}).then(function successCallback(response) {
		$scope.statusInformationList = response.data;

		console.log(response);
         console.log($scope.rawMaterialList)
	}, function errorCallback(response) {
		console.log("Error");

	});
	}

	$scope.submitInformation = function(isvaliduser, $event) {
//		if (isvaliduser) {
			$scope.saveSecurityInformation();
//		} else {
//			console.log('its else block');
//		}
	};
	
	$scope.createDate = new Date($scope.createDate);
	$scope.saveSecurityInformation = function() {
		console.log('its save function')
	
		
		var data = {

			invoice_No : $scope.invoice_No,
			vendorname : $scope.vendorname,
			vehicleNo : $scope.vehicleNo,
			driver_Name : $scope.driver_Name,
			description : $scope.description,
			createDate : $scope.createDate,
			/*intime : null,*/
			/*outtime : null,*/
			intime:$scope.intime,
			outtime:$scope.outtime,
			status:9,

			po_No : $scope.rawMaterialOrders.id,
			createdBy : 2,
			created_date : null,
			updatedBy : 1,
			updated_date : null,
			isactive : true,
			rmorderinvoiceintakquantities : $scope.rawMaterialList
		};
		$http({
			method : 'post',
			url : SERVER_URL + "rawmaterialorderinvoice/securitycheck",
			data : data
		}).then(function successCallback(data) {

			console.log(data);
		}, function errorCallback(response) {
			console.log("Error");

		});

		
		    	
	}
});



