erpApp.controller('qualityInspectionCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,
		SERVER_URL,utils,Auth,$location) {
$scope.getRMOrderInvoiceInformation=function()
	
	{
	var httpparams = {};
	httpparams.method = 'GET';
	httpparams.url = SERVER_URL + "rawmaterialorderinvoice/security-in-invoices";
	httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
	$http(httpparams).then(function successCallback(response) {
			$scope.invoiceList = response.data;
			console.log(response);
			$mdDialog.hide();
		}, function errorCallback(response) {
			console.log("Error");
			$mdDialog.hide();
		});
		 $scope.showProgressBarOne();
	}

$scope.invoiceRawMaterialList=function(index)
{
	var httpparams = {};
	httpparams.method = 'GET';
	httpparams.url = SERVER_URL + "qualitycheckrawmaterial/listrm/" + $scope.invoiceList.id;
	httpparams.headers = {
			auth_token : Auth.getAuthToken()
		};
	$http(httpparams).then(function successCallback(response) {
		$scope.rmInvoiceList = response.data;
		console.log($scope.rmInvoiceList)
		console.log(response);
		$mdDialog.hide();
	}, function errorCallback(response) {
		console.log("Error");
		$mdDialog.hide();
	});
	 $scope.showProgressBarOne();
	};

   $scope.submitInformation=function(isvaliduser, $event)
   {
	   if (isvaliduser) {
			$scope.saveQualityinspectionInformation();
		} else {
			console.log('its else block');
	}
   };
   
   $scope.resetQualityInspection=function()
   {
	   $scope.user= angular.copy(original);
		$scope.qualityInspectionForm.$setPristine();
   }
   $scope.showProgressBarOne= function()
	{
		$mdDialog
		.show(
				{
					controller : ProgressBarController,
					templateUrl : 'views/progressBar.html',
					parent : angular
							.element(document.body),
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					onComplete : function() {
					}
				})
		.then(
				function(answer) {
					$scope.status = 'You said the information was "'
							+ answer + '".';
				},
				function() {
					$scope.status = 'You cancelled the dialog.';
				});
	};
   $scope.saveQualityinspectionInformation=function()
   {
	   console.log('its save function');
	   var index = 0;
	   for(index = 0; index < $scope.rmInvoiceList.length; index++){
		   $scope.rmInvoiceList[index].intakeQuantity = $scope.rmInvoiceList[index].quantity;
	   }
	   var data = {

			   description:$scope.description,
			   id: $scope.invoiceList.id,
			   qualitycheckrawmaterials:$scope.rmInvoiceList
			   
			};
	   
	   var httpparams = {};
		httpparams.method = 'post';
		httpparams.url = SERVER_URL + "qualitycheckrawmaterial/qualitycheck";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		httpparams.data = data;
		$http(httpparams).then(function successCallback(data) {
			if(data.data.code === 1){
				console.log(data.data.message);
				console.log(data);
				$location.path('/')
				$scope.message = 'Qualitycheckrawmaterial added Successfully !';
				$scope.showToast();
				$mdDialog.hide();
			}
			else
				{
				console.log(data);
				$scope.message = 'something went wrong please try again';
				$scope.showToast();
				$mdDialog.hide();
				}
			
		}, function errorCallback(response) {
			console.log("Error");
			$mdDialog.hide();
			$scope.message = 'Something went worng. Please try again later.';
			$scope.showToast();
		});
	   $scope.showProgressBarOne();
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
