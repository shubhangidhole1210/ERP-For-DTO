erpApp.controller('securityCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils) {

	$scope.getRMInformation = function()

	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorder/list"
		}).then(function successCallback(response) {
			$scope.rawMaterialOrders = response.data;
			$scope.rawMaterials = response.data;
			utils.hideProgressBar();
			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();

		});
		utils.showProgressBar();
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
             utils.hideProgressBar();
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();

		});
		utils.showProgressBar();
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
	/*$scope.intime = $filter('date')(new Date(), 'hh:mm:ss a');
	$scope.outtime = $filter('date')(new Date(), 'hh:mm:ss a');*/
	/*$scope.intime = new Date($scope.intime);
	$scope.outtime = new Date($scope.intime);*/
	$scope.saveSecurityInformation = function() {
		console.log('its save function')
		var index=0;
		var rmorderinvoiceintakquantities = [];
		for(index=0;index<$scope.rawMaterialList.length;index++){
			var rmorderinvoiceintakquantity = {};
			rmorderinvoiceintakquantity.rawmaterial= $scope.rawMaterialList[index].id;
			rmorderinvoiceintakquantity.quantity = $scope.rawMaterialList[index].quantity;
			rmorderinvoiceintakquantity.isactive=true;
			rmorderinvoiceintakquantities.push(rmorderinvoiceintakquantity);
		}
		console.log('intime : ' + $scope.intime.getTime());
		console.log('out : ' + $scope.outtime.getTime());
		console.log('intime : ' + $scope.intime.toLocaleTimeString());
		console.log('out : ' + $scope.outtime.toLocaleTimeString());
		if($scope.intime.getTime() < $scope.outtime.getTime()){
			console.log('intime is lesser than outtime')
		}else{
			console.log('intime is greater than outtime')
		}
		var data = {

			invoice_No : $scope.invoice_No,
			vendorname : $scope.vendorname,
			vehicleNo : $scope.vehicleNo,
			driver_Name : $scope.driver_Name,
			description : $scope.description,
			createDate : $scope.createDate,
			/*intime : null,
			outtime : null,*/
			intime : $scope.intime.toLocaleTimeString().split(" ")[0],
			outtime : $scope.outtime.toLocaleTimeString().split(" ")[0],
			status:9,
			/*intime:"01:30:20",
			outtime:"01:30:20",*/
			po_No : $scope.rawMaterialOrders.id,
			createdBy : 2,
			created_date : null,
			updatedBy : 1,
			updated_date : null,
			isactive : true,
			rmorderinvoiceintakquantities : rmorderinvoiceintakquantities
		};
		$http({
			method : 'post',
			url : SERVER_URL + "rawmaterialorderinvoice/securitycheck",
			data : data
		}).then(function successCallback(data) {
			if(data.data.code === 1){
				console.log(data.data.message);
				console.log(data);
				/*$scope.message = "Rawmaterialorderinvoice added Successfully !"
				$scope.showToast();*/
				 utils.hideProgressBar();
			}
			else
				{
			/*	$scope.message = "something went wrong";*/
				/*$scope.showToast();*/
				 utils.hideProgressBar();
				}
			
			
		}, function errorCallback(response) {
			console.log("Error");
			 /*utils.hideProgressBar();
			$scope.message = 'Something went worng. Please try again later.';
			$scope.showToast();*/
			 utils.hideProgressBar();
		});

		utils.showProgressBar();
		    	
	}
	
	 $scope.showToast = function() {
			$mdToast.show({
				hideDelay : 3000,
				position : 'top right',
				controller : 'ToastCtrl',
				templateUrl : 'views/toast.html',
				locals : {
					message : $scope.message
				}
			});
		};
});



