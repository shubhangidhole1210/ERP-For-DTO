erpApp.controller('productCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils) {
	$scope.isProductPresent=false;
	$scope.product = {};
	
	$rootScope.$on("CallPopulateProductList", function() {
		$scope.populteProductList();
	});
	$rootScope.$on("saveProductError", function() {
		$scope.showAddNewProduct();
	});
	
	$scope.populteProductList=function(){
		 $scope.currentPage = 0;
	     $scope.pageSize = 15;
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "product/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(response) {
			$scope.data = response.data;
			$scope.products = response.data;
			$scope.isProductInformation();
			console.log(response);
			utils.hideProgressBar();

		}, function errorCallback(response) {
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
			console.log("Error");
			utils.hideProgressBar();
		});
	};
	
	$scope.isProductInformation = function() {
		$scope.isProductPresent = $scope.data.length === 0 ? true : false;
	};
	
	$scope.showAddNewProduct = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.product = {};
		$scope.information="ADD NEW PRODUCT"
		var addNewProductDialog = {
			controller : 'productDialogCtrl',
			templateUrl : 'views/productDialog.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : false,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				product : $scope.product,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewProductDialog)
		.then(function(answer) {},
				function() {});
	};
	
	$scope.showGenerateBom = function(ev) {
		$scope.bomInformation="GENERATE BOM"
	    $mdDialog.show({
	      controller: 'bomDialogueController',
	      templateUrl: 'views/bomGenerateDialogue.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false,
	      fullscreen: $scope.customFullscreen ,
	      locals : {
	    	  bomInformation : $scope.bomInformation
			}
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	    });
	  };
	  
	  $scope.showReturnBom = function(ev) {
		  $scope.bomInformation="DOWNLOAD BOM"
		    $mdDialog.show({
		      controller: 'bomReturnDialogueController',
		      templateUrl: 'views/bomReturnDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      fullscreen: $scope.customFullscreen,
		      locals : {
		    	  bomInformation : $scope.bomInformation
				}
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
		  };
	
	$scope.showEditProduct = function(ev, $index) {
		$scope.flag = 1;
		$scope.isReadOnly = false;
		$scope.information= "EDIT PRODUCT INFORMATION";
		$scope.product = $scope.products[($scope.currentPage*$scope.pageSize) + ($index)];
		console.log($scope.product);
		$mdDialog
				.show({
					controller : 'productDialogCtrl',
					templateUrl : 'views/productDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						product : $scope.product,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
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
	
	$scope.viewProductInformation = function(ev, $index) {
		$scope.flag = 2;
		$scope.isReadOnly = true;
		$scope.product = $scope.products[($scope.currentPage*$scope.pageSize) + ($index)];
		$scope.isSaving = false;
		$scope.information="VIEW PRODUCT INFORMATION"
		console.log($scope.product);
		$mdDialog.show({
					controller : 'productDialogCtrl',
					templateUrl : 'views/productDialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					locals : {
						product : $scope.product,
						flag : $scope.flag,
						action : $scope.isReadOnly,
						information : $scope.information
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
	
	$scope.deleteProduct = function(index) {
		console.log($scope.product);
		var httpparams = {};
		httpparams.method = 'delete';
		httpparams.url = SERVER_URL + "product/delete/" + $scope.products[index].id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		$http(httpparams).then(function successCallback(data) {
					$mdDialog.hide();
			$rootScope.$emit("CallPopulateProductList", {});
			console.log(data);
			$scope.message = 'Delete Product Record sucessfully';
			$scope.showToast();
		}, function errorCallback(data) {
			console.log("Error");
			utils.showToast("We are Sorry. Something went wrong. Please try again later.");
		});
		$scope.showProgressBarOne();
	};

	$scope.showConfirm = function(ev,$index) {
		var confirm = $mdDialog.confirm().title(
				'Are you sure you want to Delete Product Information?')
				.ariaLabel('Lucky day').targetEvent(ev).ok(
						'YES' ).cancel('NO');
		$mdDialog
				.show(confirm)
				.then(
						function() {
							$scope.status = 'You decided to get rid of your debt.';
							$scope.deleteProduct(($scope.currentPage*$scope.pageSize) + ($index));
						},
						function() {
							$scope.status = 'You decided to keep your debt.';
						});
	};
	
	$scope.gotoPrevPage = function(){
		 utils.scrollToTop();
		 $scope.currentPage = $scope.currentPage - 1;
	};
	
	$scope.gotoNextPage = function(){
		 utils.scrollToTop();
		 $scope.currentPage = $scope.currentPage + 1;
	};
	
});