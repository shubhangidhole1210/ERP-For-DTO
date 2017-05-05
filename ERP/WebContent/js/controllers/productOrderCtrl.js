erpApp.controller('productOrderCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	
	$scope.isProductOrderPresent=false;
	$scope.productOrder={};
	
	$rootScope.$on("callPopulateProductOrderList", function() {
		$scope.populateProductOrderList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductOrder()
	});
	
	$scope.populateProductOrderList = function() {
		utils.showProgressBar();
		        var httpparams = {};
		         httpparams.method = 'GET';
		         httpparams.url = SERVER_URL + "productorder/list";
		        httpparams.headers = {
				      auth_token : Auth.getAuthToken()
			        };
		
					$http(httpparams).then( function successCallback(response) {
								$scope.data = response.data;
								$scope.productOrders = response.data;
								console.log(response);
								$scope.isProductOrderInformation();
								utils.hideProgressBar();
							},
							function errorCallback(response) {
								/*$scope.showToast();*/
								console.log("Error");
								/*$scope.message = "We are Sorry. Something went wrong. Please try again later."*/
								utils.showToast('We are Sorry. Something went wrong. Please try again later.');
								utils.hideProgressBar();
			});
	};
	
	/*$scope.isProductOrderInformation=function()	{
		if($scope.data.length==0)
			$scope.isProductOrderPresent=true;
		else
			$scope.isProductOrderPresent=false;
	};*/
	
	$scope.isProductOrderInformation = function() {
		$scope.isProductOrderPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.showAddNewProductOrder = function(ev) {
		 $rootScope.isAddButtonDisplay=true;
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.isProductOrderAdd = true;
		$scope.information="ADD NEW PRODUCT ORDER";
		$scope.productOrder={};
		var addNewProductOrderDialog = {
			controller : 'productOrderDialogCtrl',
			templateUrl : 'views/productOrderInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				productOrder : $scope.productOrder,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information,
				hideAction : $scope.isProductOrderAdd,
			}
		};
		$mdDialog
		.show(addNewProductOrderDialog)
		.then(function(answer) {},
				function() {});
	  };
	 
	  $scope.showEditProductOrder = function(ev , index) {
		  $scope.flag = 1;
		  $scope.productOrder = $scope.productOrders[index];
		  $scope.isProductOrderAdd = false;
		  $scope.information="EDIT PRODUCT ORDER INFORMATION"
		    $mdDialog.show({
		      controller: 'productOrderDialogCtrl',
		      templateUrl: 'views/productOrderInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  productOrder : $scope.productOrder,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information,
		    	  hideAction : $scope.isProductOrderAdd,
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteProductOrder = function(index) {
			console.log($scope.vendoUser);
			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "productorder/delete/" + + $scope.productOrders[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
				utils.hideProgressBar();
						$rootScope.$emit("callPopulateProductOrderList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			utils.showProgressBar();
		};
		
		$scope.viewProductOrderrInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.isProductOrderAdd = false;	
			$scope.productOrder = $scope.productOrders[index];
			$scope.isSaving = false;
			$scope.information="VIEW PRODUCT ORDER INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'productOrderDialogCtrl',
						templateUrl : 'views/productOrderInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							  productOrder : $scope.productOrder,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information,
							hideAction : $scope.isProductOrderAdd,
						}
					})
					.then(function(answer) {},
							function() {});
		};
		$scope.showConfirm = function(ev,index) {
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete Product Order Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'YES' ).cancel('NO');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteProductOrder(index);
								utils.showToast('Product Order Deleted Sucessfully!');
								
								
							},
							function() { });
		};
		
	
});
















