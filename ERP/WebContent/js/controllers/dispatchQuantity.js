erpApp.controller('dispatchQuantityCtrl', function($scope, $http, $mdDialog, $mdToast,
		$rootScope, SERVER_URL,$filter,utils,Auth,$location) {
	
	
	$scope.populateProductOrderPendingList = function() {
		utils.showProgressBar();
		        var httpparams = {};
		         httpparams.method = 'GET';
		         httpparams.url = SERVER_URL + "productorder/pendingList";
		        httpparams.headers = {
				      auth_token : Auth.getAuthToken()
			        };
		
					$http(httpparams).then( function successCallback(response) {
								$scope.productOrders = response.data;
								console.log(response);
								utils.hideProgressBar();
							},
							function errorCallback(response) {
								$scope.showToast();
								console.log("Error");
								$scope.message = "We are Sorry. Something went wrong. Please try again later."
								utils.hideProgressBar();
			});
	};
	
	
	$scope.getDispatchquantity=function($index)
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productorderassociation/getProductOrderInventoryData/" +$scope.order.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			console.log(response);
			$scope.data = response.data;
			$scope.orderProductList = response.data.data;
			
		}, function errorCallback(response) {
			console.log("Error");

		});
	};
	
	
	
	$scope.submitInformation = function($event) {
		$scope.saveDispatchQuantity();
		
};
	$scope.saveDispatchQuantity=function()
	{
		console.log($scope.data.data);
		var index=0;
		var productsList = [];
		for(index=0;index<$scope.data.data.length;index++){
			var dispatchProduct = {};
			dispatchProduct.productId= $scope.data.data[index].productId;
			dispatchProduct.quantity = $scope.data.data[index].remainingQuantity;
			productsList.push(dispatchProduct);
		}
		data=
			{
				orderId: $scope.order.id,
				invoiceNo: $scope.invoice,
				description:$scope.description,
				parts:productsList
			};
		var httpparams = {
				method : 'post',
				url : SERVER_URL + "dispatch/dispatchProducts",
				data : data
			};
		
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
			console.log(data);
			if(data.data.code === 1){
				utils.showToast(data.data.message);
				$location.path('/');
			}else{
				utils.showToast(data.data.message);
				$location.path('/');
			}
			utils.hideProgressBar();
			
		}, function errorCallback(response) {
			console.log("Error");
			utils.showToast("Something went wrong. Please try again later.");
			utils.hideProgressBar();
		});
		utils.showProgressBar();
	}
	
	$scope.cancelDispatchQuantityForm=function(){
		$location.path('/');
	}
	
});
