erpApp.controller('securityCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL) {

	$scope.getRMInformation = function()

	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorder/list"
		}).then(function successCallback(response) {
			$scope.rawMaterialOrders = response.data;
			/*$scope.rawMaterials = response.data;*/
			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}

	$scope.displayRMList = function(index) {
		console.log($scope.rawMaterials)
		$http({
				method : 'GET',
				url : SERVER_URL + "rawmaterial/getRMForRMOrder/"+ $scope.rawMaterialOrder.id
				/*url : SERVER_URL + "rawmaterial/getRMForRMOrder/"+ $scope.rawmaterialorderassociation.id*/
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
			/*intime : null,
			outtime : null,*/
			intime:'01:30:20',
			outtime:'01:30:20',
			status : 4,
			po_No : $scope.po_No,
			createdBy : 2,
			created_date : null,
			updatedBy : 1,
			updated_date : null,
			isactive : true,
			rmorderinvoiceintakquantities : $scope.rawMaterialLists
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

		 $scope.rawMaterialLists=[];
		    $scope.rawMaterialList={};
		    	if(!angular.equals($scope.rawMateriaslList,{})){
					   $scope.rawMaterialLists.push($scope.rawMaterialList);	
					   $scope.rawMateriaslList = {};
					   console.log($scope.rawMaterialList);
					 
				}
		
		
		
		 
		
	}

});
