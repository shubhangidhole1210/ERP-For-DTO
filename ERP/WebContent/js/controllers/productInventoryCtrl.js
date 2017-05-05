erpApp.controller('productInventoryCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	$scope.isProductInventoryPresent=false;
	$rootScope.$on("callPopulateProductInventoryList", function() {
		$scope.populateProductInventoryList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductInventory()
	});
	
	$scope.populateProductInventoryList=function()
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productinventory/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.productInventorys = response.data.data;
				$scope.isProductInventoryinformation();
				console.log(response);
				utils.hideProgressBar();
			}, function errorCallback(response) {
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();
			});
	}

	/*$scope.isProductInventoryPresent=false;
	$scope.isProductInventoryinformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isProductInventoryPresent=true;
			}
		else{
			$scope.isProductInventoryPresent=false;
		}
	}*/
	
	$scope.isProductInventoryinformation=function(){
		$scope.isProductInventoryPresent= $scope.data.length === 0  ? true:false;
	}
	
	
	$scope.productInventory={};
	
	$scope.showAddNewProductInventory = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW PRODUCT INVENTORY";
		$scope.productInventory={};
		var addNewProductInventoryDialog = {
			controller : 'productInventoryDialogController',
			templateUrl : 'views/productInventoryInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				productInventory : $scope.productInventory,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewProductInventoryDialog)
		.then(function(answer) {},
				function() {});
	  };
	  $scope.showEditProductInventory = function(ev , index) {
		  $scope.flag = 1;
		  $scope.isReadOnly = false;
		  $scope.productInventory = $scope.productInventorys[index];
		  $scope.information="EDIT PRODUCT INVENTORY INFORMATION"
		    $mdDialog.show({
		      controller: 'productInventoryDialogController',
		      templateUrl: 'views/productInventoryInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  productInventory : $scope.productInventory,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteProductInventory = function(index) {
		
			console.log($scope.vendoUser);

			
			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "productinventory/delete/"  + $scope.productInventorys[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
						$mdDialog.hide();
						$rootScope.$emit("callPopulateProductInventoryList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			$scope.showProgressBarOne();

		};
		
		$scope.viewProductInventoryInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.productInventory = $scope.productInventorys[index];
			$scope.isSaving = false;
			$scope.information="VIEW PRODUCT INVENTORY INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'productInventoryDialogController',
						templateUrl : 'views/productInventoryInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							  productInventory : $scope.productInventory,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information
						}
					})
					.then(function(answer) {},
							function() {});
		};
		$scope.showConfirm = function(ev,index) {
			// Appending dialog to document.body to cover sidenav in docs app
			var confirm = $mdDialog.confirm().title(
					'Are you sure you want to Delete Product Inventory Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'YES' ).cancel('NO');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteProductInventory(index);
								
								$scope.message = 'Delete Record sucessfully';
								$scope.showToast();
								
							},
							function() {
								$scope.status = 'You decided to keep your debt.';
							});
		};
		
});
















