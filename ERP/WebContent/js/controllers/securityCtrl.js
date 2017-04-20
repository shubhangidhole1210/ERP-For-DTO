erpApp.controller('securityCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location) {

	$scope.getRMInformation = function()

	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterialorder/list/securityCheck";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.rawMaterialOrders = response.data;
			$scope.rawMaterials = response.data;
			/*$scope.getRmOrderInfo()*/
			utils.hideProgressBar();
			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();

		});
		utils.showProgressBar();
	}

		
	$scope.displayRMList = function(index) {
		console.log($scope.rawMaterials);
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterialorderassociation/getRMForRMOrder/"+ $scope.rawMaterialOrders.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
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
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterialorderinvoice/liststatus/"+ $scope.rawmaterialorderinvoice.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
		$scope.statusInformationList = response.data;
		utils.hideProgressBar();
		console.log(response);
         console.log($scope.rawMaterialList)
	}, function errorCallback(response) {
		console.log("Error");
		utils.hideProgressBar();
	});
		utils.showProgressBar();
		
	}

	$scope.submitInformation = function($event) {
			$scope.saveSecurityInformation();
			
	};
	$scope.createDate = new Date($scope.createDate);
	$scope.saveSecurityInformation = function() {
		console.log('Saving saveSecurityInformation');
		var index=0;
		var rmorderinvoiceintakquantities = [];
		for(index=0;index<$scope.rawMaterialList.length;index++){
			var rmorderinvoiceintakquantity = {};
			rmorderinvoiceintakquantity.rawmaterial= $scope.rawMaterialList[index].rawmaterial.id;
			rmorderinvoiceintakquantity.quantity = $scope.rawMaterialList[index].invoiceQuantity;
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
			vendorname : $scope.selectedVendor,
			vehicleNo : $scope.vehicleNo,
			driver_Name : $scope.driver_Name,
			description : $scope.description,
			createDate : $scope.createDate,
			intime : $scope.intime.toLocaleTimeString().split(" ")[0],
			outtime : $scope.outtime.toLocaleTimeString().split(" ")[0],
			po_No :  $scope.rawMaterialOrders.id,
			rmorderinvoiceintakquantities : rmorderinvoiceintakquantities
		};
		var httpparams = {
				method : 'post',
				url : SERVER_URL + "rawmaterialorderinvoice/securitycheck",
				data : data
			};
		
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			
			console.log(data.data.message);
			console.log(data);
			
			if(data.data.code === 1){
				utils.showToast("Rawmaterial Order Invoice added Successfully !");
				$location.path('/');
			}else{
				utils.showToast("Something went wrong. Please try again later.");
			}
			utils.hideProgressBar();
			
		}, function errorCallback(response) {
			console.log("Error");
			utils.showToast("Something went wrong. Please try again later.");
			utils.hideProgressBar();
		});

		utils.showProgressBar();
		    	
	};
	
	
	$scope.toCompareQuantity=function(remainingQuantity,invoiceQuantity){
		console.log(remainingQuantity);
		console.log(invoiceQuantity)
		$scope.errorMsg="";
		if(remainingQuantity>=invoiceQuantity){
			console.log("Valid invoice quantity");
		}else{
			console.log("In-Valid invoice quantity");
		}
			
	};
	$scope.displayVendorId=function()
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "vendor/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		
		$http(httpparams).then(function successCallback(response) {
			$scope.vendorData = response.data;

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		})
	};
	
	$scope.vendorRmOrder=function(index)
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "rawmaterialorder/getVendorOrder/"+$scope.selectedVendor;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
				
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.vendorRmList = response.data;
			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");
		})
	}
	

	
	/*$scope.getRmOrderInfo=function()
	{ 
		
		console.log('rmlist'+$scope.vendorRmList);
		if($scope.vendorRmList.length==0)
			{
			  $scope.securityInformation.rawMaterial.$setValidity("apierror", false);
			  
			}
		else {
			
		}
	}*/
	
	/*$scope.isRMOrderpresent=false;
	$scope.getRmOrderInfo=function()
	{ 
		
		console.log('rmlist'+$scope.vendorRmList);
		if($scope.vendorRmList.length==0)
			{
			  
			$scope.isRMOrderpresent=true;
			}
		else {
			$scope.isRMOrderpresent=false;
		}
	}*/
	
	
	/*var original = $scope.user;
	$scope.restInformation=function()
	{
		$scope.user= angular.copy(original);
		$scope.securityInformation.$setPristine();
	}*/
	
	$scope.restInformation=function(){
		$location.path('/')
	}
	
});



