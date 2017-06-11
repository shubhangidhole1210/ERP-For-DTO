erpApp.controller('productRMAssociationCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	$scope.isProductRmAssociationPresent=false; 
	$scope.productRmAsso={};
	
	$rootScope.$on("callPopulateProductRmAssociationList", function() {
		$scope.populateProductRmAssoList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewProductRMAssociation();
	});
	
	$scope.populateProductRmAssoList=function(){
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "productRMAsso/list/multiple";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.productRmAssociations=response.data;
				$scope.productRMAssociationModelParts = response.data.productRMAssociationModelParts;
				$scope.productRmAssociationInformation();
				utils.hideProgressBar();
				console.log(response);
				console.log('productRMAssociationModelParts' + $scope.productRMAssociationModelParts);
			}, function errorCallback(response) {
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();
			});
	};
	
	$scope.productRmAssociationInformation = function() {
		$scope.isProductRmAssociationPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.showAddNewProductRMAssociation = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.productIdReadOnly = false;
		$scope.information="ADD NEW PRODUCT RM ASSOCIATION";
		$scope.productRmAsso = {};
		var addNewProductRmAssoDialog = {
			controller : 'productRmAssociationDialogController',
			templateUrl : 'views/productRMAssociationDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				productRmAsso : $scope.productRmAsso,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information,
				productAction : $scope.productIdReadOnly
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
		  $scope.productIdReadOnly = true;
		  $scope.productRmAsso = $scope.productRmAssociations[index];
		  /*console.log("sending ..", $scope.productRmAsso);*/
		  console.log("in edit function product id is : " +$scope.productRmAsso.product)
		  
		  $scope.information="EDIT PRODUCT RM ASSOCIATION"
		    $mdDialog.show({
		      controller: 'productRmAssociationDialogController',
		      templateUrl: 'views/productRMAssociationDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  productRmAsso : $scope.productRmAsso,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information,
		    	  productAction : $scope.productIdReadOnly
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteProductRMAssociation = function(index) {
			console.log($scope.vendoUser);
			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "productRMAsso/delete/" + $scope.productRmAssociations[index].product;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
						$mdDialog.hide();
						$rootScope.$emit("callPopulateProductRmAssociationList", {});
				console.log(data);
				utils.showToast('Product Rm Association Deleted Sucessfully!');
			}, function errorCallback(data) {
				console.log("Error");
				$mdDialog.hide();
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			});
			utils.showProgressBar();
		};
		
		$scope.viewproductRMAssociationInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.productIdReadOnly = true;
			 $scope.productRmAsso = $scope.productRmAssociations[index];
			$scope.isSaving = false;
			$scope.information="VIEW PRODUCT RM ASSOCIATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'productRmAssociationDialogController',
						templateUrl : 'views/productRMAssociationDialog.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							productRmAsso : $scope.productRmAsso,
							flag : $scope.flag,
							action : $scope.isReadOnly,
							information : $scope.information,
							productAction : $scope.productIdReadOnly
						}
					})
					.then(function(answer) {},
							function() {});
		};
		$scope.showConfirm = function(ev,index) {
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

