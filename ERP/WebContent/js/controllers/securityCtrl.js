erpApp.controller('securityCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL) {

	$scope.getRMInformation = function()

	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorder/list"
		}).then(function successCallback(response) {
			$scope.rawMaterialOrders = response.data;

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}

	$scope.displayRMList = function(index) {
		console.log($scope.rawMaterials)
		$http({
				method : 'GET',
				url : SERVER_URL + "rawmaterial/getRMForRMOrder/"+ $scope.rawMaterialOrder
				}).then(function successCallback(response) {
			$scope.rawMaterialList = response.data;

			console.log(response);

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
	$scope.checkErr = function(intime, outtime) {
		$scope.errMessage = '';
		/* var curTime = new Time(); */
		$scope.curTime = new Time();

		if (new Time(intime) > new Time(outtime)) {
			$scope.errMessage = 'End Date should be greater than start date';
			return false;
		}
		if (new Date(intime) < curTime) {
			$scope.errMessage = 'Start date should not be before today.';
			return false;
		}
	};

	$scope.saveSecurityInformation = function() {
		console.log('its save function')
		
		// iterate populated Raw material table and create list of objects with 'id' and 'quantity' for each row.
		//assign that list to 'rawmaterialorderinvoiceassociations' in data
		var data = {

			invoice_No : $scope.invoice_No,
			vendorname : $scope.vendorname,
			vehicleNo : $scope.vehicleNo,
			driver_Name : $scope.driver_Name,
			description : $scope.description,
			createDate : 2017 - 01 - 25,
			intime : null,
			outtime : null,
			status : 4,
			po_No : $scope.po_No,
			createdBy : 2,
			created_date : null,
			updatedBy : 1,
			updated_date : null,
			isactive : true,
			rawmaterialorderinvoiceassociations : $scope.rawMaterialList
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
