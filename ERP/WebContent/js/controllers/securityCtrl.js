erpApp.controller('securityCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,
		SERVER_URL) {
          
	
	$scope.getRMInformation=function()
	
	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorder/list"
		}).then(function successCallback(response) {
			$scope.rawMaterials = response.data;
			

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}
	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorderinvoice/list"
		}).then(function successCallback(response) {
			$scope.rawMaterials = response.data;
			

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}
	
	$scope.submitInformation = function(isvaliduser, $event) {
		if (isvaliduser) {
			$scope.saveSecurityInformation();
		} else {
			console.log('its else block');
		}
	};
	 $scope.checkErr=function(intime,outtime)
	 {
		 $scope.errMessage = '';
	       /* var curTime = new Time();*/
		 $scope.curTime=new Time();
	        
	        if(new Time(intime) > new Time(outtime)){
	          $scope.errMessage = 'End Date should be greater than start date';
	          return false;
	        }
	        if(new Date(intime) < curTime){
	           $scope.errMessage = 'Start date should not be before today.';
	           return false;
	        }
	 };
	
	$scope.saveSecurityInformation=function()
	{
		console.log('its save function')
		var data = {

				invoice_No: $scope.invoice_No,
				vendorname:$scope.vendorname,
				vehicleNo:$scope.vehicleNo,
				driver_Name:$scope.driver_Name,
				description:$scope.description,
				createDate:2017-01-25,
				intime:null,
				outtime:null,
				status:4,
				po_No: $scope.po_No,
				createdBy:2,
				created_date:null,
				updatedBy:1,
				updated_date:null,
				isactive:true
			};
		$http({
			method : 'post',
			url : SERVER_URL + "rawmaterialorderinvoice/create",
			data : data
		}).then(function successCallback(data) {
			
			console.log(data);
		}, function errorCallback(response) {
			console.log("Error");

		});
		
	}
	
	
});
