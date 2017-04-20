erpApp.controller('productRMAssociationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	
	$rootScope.$on("callPopulateProductRmAssociationList", function() {
		$scope.populateProductRmAssoList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductRMAssociation()
	});
	
	
	$scope.populateProductRmAssoList=function()
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productRMAsso/list/multiple";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.productRmAssociations=response.data
				$scope.productRMAssociationModelParts = response.data.productRMAssociationModelParts;
				$scope.productRmAssociationInformation();
				utils.hideProgressBar();
				console.log(response);
				console.log('productRMAssociationModelParts' + $scope.productRMAssociationModelParts)

			}, function errorCallback(response) {
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();
			});
	}
	
	$scope.isProductRmAssociationPresent=false; 
	$scope.productRmAssociationInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isProductRmAssociationPresent=true; 
			}
		else
			{
			$scope.isProductRmAssociationPresent=false; 
			}
	}
	
	
	$scope.productRmAsso={};
	
	$scope.showAddNewProductRMAssociation = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW PRODUCT RM ASSOCIATION";
		$scope.productRmAsso = {};
		var addNewProductRmAssoDialog = {
			controller : 'productRmAssociationDialogController',
			templateUrl : 'views/productRMAssociationInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				productRmAsso : $scope.productRmAsso,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewProductRmAssoDialog)
		.then(function(answer) {},
				function() {});
	  };
	  
	  
	  $scope.showEditproductRMAssociation = function(ev , index) {
		  $scope.flag = 1;
		  $scope.isReadOnly = false;
		  $scope.productRmAsso = $scope.productRmAssociations[index];
		  console.log("sending ..", $scope.productRmAsso);
		  $scope.information="EDIT PRODUCT RM ASSOCIATION"
		    $mdDialog.show({
		      controller: 'productRmAssociationDialogController',
		      templateUrl: 'views/productRMAssociationInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  productRmAsso : $scope.productRmAsso,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteProductRMAssociation = function(index) {
			/* $scope.user = $scope.users[index].id; */
			console.log($scope.vendoUser);

			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "productRMAsso/delete/" + $scope.productRmAssociations[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
						$mdDialog.hide();
						$rootScope.$emit("callPopulateProductRmAssociationList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			utils.showProgressBar();
		};
		
		$scope.viewproductRMAssociationInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			 $scope.productRmAsso = $scope.productRmAssociations[index];
			$scope.isSaving = false;
			$scope.information="VIEW PRODUCT RM ASSOCIATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'productRmAssociationDialogController',
						templateUrl : 'views/productRMAssociationInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							productRmAsso : $scope.productRmAsso,
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
					'Are you sure you want to Delete Product RM Asssociation Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'Delete' ).cancel('Cancel');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteProductRMAssociation(index);
								utils.showToast('Product Rm Association Deleted Sucessfully!');
							},
							function() { });
		};
		
	
});
















