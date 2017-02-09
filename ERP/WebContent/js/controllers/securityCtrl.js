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
	
	$scope.displayRMList=function(index)
	{
		console.log($scope.rawMaterials)
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterial/getRMForRMOrder/"+ $scope.rawmaterialorderassociation.id
		
		}).then(function successCallback(response) {
			$scope.rawMaterialList = response.data;

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
	/* $scope.checkErr=function(intime,outtime)
	 {
		 $scope.errMessage = '';
	        var curTime = new Time();
		 $scope.curTime=new Time();
	        
	        if(new Time(intime) > new Time(outtime)){
	          $scope.errMessage = 'End Date should be greater than start date';
	          return false;
	        }
	        if(new Time(intime) < curTime){
	           $scope.errMessage = 'Start date should not be before today.';
	           return false;
	        }
	 };*/
	
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
				/*intime:'01:30:20',
				outtime:'01:30:20',*/
				intime:$scope.intime,
				outtime:$scope.outtime,
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
			url : SERVER_URL + "rawmaterialorderinvoice/securitycheck",
			data : data
		}).then(function successCallback(data) {
			if (data.code === 0) {
				console.log(data.message);
				console.log(data);
				$scope.hide();
				$scope.message = 'Something went worng. Please try again later.';
				$scope.showToast();
			} 
			else {
				$scope.displayProgressBar = false;
				$scope.message = 'Information saved successfully.';
				$scope.showToast();
			}
			
			
		}, function errorCallback(response) {
			console.log("Error");

		});
		
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
	function ProgressBarController($scope, $mdDialog) {
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	}
	
});
