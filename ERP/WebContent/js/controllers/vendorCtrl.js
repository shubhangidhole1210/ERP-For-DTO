erpApp.controller('vedorCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,utils) {
	
	$rootScope.$on("callPopulateVendorList", function() {
		$scope.populateVendorList();
	});
	$rootScope.$on("saveVendorError", function() {
		$scope.showAddNewVendor()
	});
	
	
	$scope.populateVendorList=function()
	{
		utils.showProgressBar();
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "vendor/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
				$scope.data = response.data;
				$scope.isVendorInformation();
				$scope.vendorUsers = response.data;
				utils.hideProgressBar();
				console.log(response);

			}, function errorCallback(response) {
				/*$scope.showToast();
				$scope.message = "We are Sorry. Something went wrong. Please try again later."*/
				utils.showToast("We are Sorry. Something went wrong. Please try again later.");
				console.log("Error");
				utils.hideProgressBar();

			});
	}
	
	/*$scope.showToast = function() {
		$mdToast.show({
			hideDelay : 3000,
			position : 'top right',
			controller : 'ToastCtrl',
			templateUrl : 'views/toast.html',
			locals : {
				message : $scope.message
			}
		});
	};*/
	 
	$scope.isVendorPredent =false;
	$scope.isVendorInformation=function()
	{
		if($scope.data.length==0)
			{
			$scope.isVendorPredent =true;
			}
		else
			{
			$scope.isVendorPredent =false;
			}
			
	}
	/*$scope.showProgressBarOne= function()
	{
		$mdDialog
		.show(
				{
					controller : ProgressBarController,
					templateUrl : 'views/progressBar.html',
					parent : angular
							.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					onComplete : function() {
						$scope.populateUserList(ev);
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
	*/
	$scope.vendorUser={};
	
	$scope.showAddNewVendor = function(ev) {
		$scope.flag = 0;
		$scope.isReadOnly = false;
		$scope.information="ADD NEW VENDOR";
		$scope.vendorUser={};
		var addNewVendorDialog = {
			controller : 'DialogVendorController',
			templateUrl : 'views/vendorInformation.html',
			parent : angular.element(document.body),
			targetEvent : ev,
			clickOutsideToClose : true,
			onRemoving : function(){console.log('Removing user dialog');},
			fullscreen : $scope.customFullscreen,
			locals : {
				vendorUser : $scope.vendorUser,
				flag : $scope.flag,
				action : $scope.isReadOnly,
				information : $scope.information
			}
		};
		$mdDialog
		.show(addNewVendorDialog)
		.then(function(answer) {},
				function() {});
	  };
	 /* function DialogVendorController($scope, $mdDialog,vendorUser,flag,action,$rootScope,$mdToast,information) {
		    $scope.vendorUser=vendorUser;
		    $scope.flag=flag;
		    $scope.isReadOnly = action;
		    $scope.information = information;
		    $scope.hide = function() {
		      $mdDialog.hide();
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };

		    $scope.answer = function(answer) {
		      $mdDialog.hide(answer);
		    };
		    
		    $scope.saveVendorInfo=function(ev)
		    {
		    	 console.log($scope.data)
		    	 var data = {

		    		 companyName : $scope.vendorUser.companyName,
		    		 email: $scope.vendorUser.email,
		    		 firstName : $scope.vendorUser.firstName ,
		    		 lastName : $scope.vendorUser.lastName,
		    		 address : $scope.vendorUser.address, 
		    		 contactNumberMobile : $scope.vendorUser.contactNumberMobile,
		    		   "contactNumberOffice": 9403633306,
		    		 city : $scope.vendorUser.city,
		    		 state : $scope.vendorUser.state,
		    		 postalcode : $scope.vendorUser.postalcode,
		    		 "createdBy":2,
		    		 "created_date":null,
		    		 "updatedBy":1,
		    		 "updated_date":null,
		    		 "isactive":true,
		    		 description: $scope.vendorUser.description
					};
		    	 
		    	
		    	 var httpparams = {};
		    	 if($scope.flag==0)
		    		 {
		    		    httpparams.method='post',
		    		    httpparams.url=SERVER_URL + "vendor/create"
		    		    httpparams.headers = {
		    					auth_token : Auth.getAuthToken()
		    				};
		    		 }
		    	 else
		    		 {
		    		      data.id=$scope.vendorUser.id,
		    		      httpparams.method='put',
		    		      httpparams.url=SERVER_URL + "vendor/update"
		    		      httpparams.headers = {
			    					auth_token : Auth.getAuthToken()
			    				};
		    		 }
		    	 
		    	 httpparams.data=data;
		    	 $http(httpparams)
		    	 .then(
							function successCallback(data) {
								$mdDialog.hide();
								console.log(data);
								if(data.data.code === 0){
									console.log(data.data.message);
									$rootScope.$emit(
											"saveVendorError", {});
									console.log(data);
									$scope.hide();
									$scope.message = 'Something went worng. Please try again later.';
									$scope.showToast();
								}
								else if(data.data.code===2)
									{
									console.log(data.data.message);
									$rootScope.$emit(
											"saveVendorError", {});
									console.log(data);
									$scope.hide();
									$scope.message = data.data.message;
									$scope.showToast();
									 
									}
								
								else{
									$scope.displayProgressBar = false;
									$scope.message = 'Vendor Information saved successfully.';
									$scope.showToast();
									$rootScope.$emit("callPopulateVendorList",{});
								}
							},
							function errorCallback(data) {
								$rootScope.$emit(
										"saveVendorError", {});
								console.log(data);
								$scope.hide();
								$scope.message = 'Something went worng. Please try again later.';
								$scope.showToast();
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
			
			
			$scope.submitVendorInformation = function(isvaliduser,$event) {
				if (isvaliduser) {
					$scope.showProgressBar($event);
					
				} else {
					console.log('its else block');
				}

			}
		    
		    $scope.showProgressBar = function(ev) {
				$scope.displayProgressBar = true;
				$mdDialog
						.show(
								{
									controller : ProgressBarController,
									templateUrl : 'views/progressBar.html',
									parent : angular
											.element(document.body),
									targetEvent : ev,
									clickOutsideToClose : false,
									fullscreen : $scope.customFullscreen,
									onComplete : function() {
										$scope.saveVendorInfo(ev);
									}
									
								// Only for -xs, -sm breakpoints.
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
		    
		  }
	  */
	  
	  $scope.showEditVendor = function(ev , index) {
		  $scope.flag = 1;
		  $scope.vendorUser = $scope.vendorUsers[index];
		  $scope.information="EDIT VENDOR INFORMATION"
		    $mdDialog.show({
		      controller: 'DialogVendorController',
		      templateUrl: 'views/vendorInformation.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen ,
		      locals : {
		    	  vendorUser : $scope.vendorUser,
		    	  flag : $scope.flag,
		    	  action : $scope.isReadOnly,
		    	  information : $scope.information
				}
		    })
		    .then(function(answer) {},
					function() {});
		  };
	  
	  $scope.deleteVendor = function(index) {
			/* $scope.user = $scope.users[index].id; */
			console.log($scope.vendoUser);

			/*$http(
					{
						method : 'delete',
						url : SERVER_URL + "vendor/delete/"
								+ $scope.vendorUsers[index].id

					})*/
			
			var httpparams = {};
			httpparams.method = 'delete';
			httpparams.url = SERVER_URL + "vendor/delete/" + + $scope.vendorUsers[index].id;
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
			$http(httpparams).then(function successCallback(data) {
/*						$mdDialog.hide();*/
				utils.hideProgressBar();
						$rootScope.$emit("callPopulateVendorList", {});
				console.log(data);

			}, function errorCallback(data) {
				console.log("Error");

			});
			/*$scope.showProgressBarOne();*/
			utils.showProgressBar();
		};
		
		$scope.viewVendarInformation = function(ev, index) {
			$scope.flag = 2;
			$scope.isReadOnly = true;
			$scope.vendorUser = $scope.vendorUsers[index];
			$scope.isSaving = false;
			$scope.information="VIEW VENDOR INFORMATION"
			console.log($scope.user);
			$mdDialog.show({
						controller : 'DialogVendorController',
						templateUrl : 'views/vendorInformation.html',
						parent : angular.element(document.body),
						targetEvent : ev,
						clickOutsideToClose : true,
						fullscreen : $scope.customFullscreen,
						locals : {
							  vendorUser : $scope.vendorUser,
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
					'Are you sure you want to Delete Vendor Information?')
					.ariaLabel('Lucky day').targetEvent(ev).ok(
							'Delete' ).cancel('Cancel');

			$mdDialog
					.show(confirm)
					.then(
							function() {
								$scope.status = 'You decided to get rid of your debt.';
								$scope.deleteVendor(index);
								/*
								$scope.message = 'Delete Vendor Record sucessfully';
								$scope.showToast();*/
								utils.showToast('Vendor Deleted Sucessfully!');
								
							},
							function() { });
		};
		
		/*function ProgressBarController($scope, $mdDialog) {
			
			$scope.hide = function() {
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
		}*/
	
});
















