erpApp.controller('userTypePageDialogCtrl',function($scope, $http, $mdDialog, $mdToast, $rootScope, SERVER_URL, utils, Auth, userTypePageAsso, $location, flag, action, information){
	 $scope.userTypePageAsso=userTypePageAsso;
	    $scope.flag=flag;
	    $scope.isReadOnly = action;
	    $scope.information = information;
	    $scope.userPages =[];
	    $scope.userPage={};
	
	$scope.hide = function() {
		console.log('hide DialogController');
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};

	  $scope.saveUserTypePage=function(ev)
	    {
	    	 var data = {
	    			 userTypePageAssoParts:$scope.userPages,
	    			 usertypeId:$scope.userTypePageAsso.usertype.id
				};
	    	 
	    	 var httpparams = {};
	    	 if($scope.flag==0)
	    		 {
	    		    httpparams.method='post',
	    		    httpparams.url=SERVER_URL + "usertypepageassociation/createMultiple";
	    		    httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
	    		 }
	    	 else
	    		 {
	    		      data.id=$scope.userTypePageAsso.id,
	    		      httpparams.method='put',
	    		      httpparams.url=SERVER_URL + "usertypepageassociation/update";
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
								utils.showToast("Something went worng. Please try again later.");
							}else{
								$scope.displayProgressBar = false;
								utils.showToast(data.data.message);
								$rootScope.$emit("callPopulateUserTypePageAsso",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveVendorError", {});
							console.log(data);
							$scope.hide();
							utils.showToast("Something went worng. Please try again later.");
						});
	    };

	    $scope.submitUserTypePageInformation = function(isvaliduser,$event) {
			if (isvaliduser) {
				$scope.saveUserTypePage($event);
			} else {
				console.log('its else block');
				utils.showToast("Please fill required information");
			}
		};
		
		 $scope.getUserType=function(){
			  var httpparams = {};
				httpparams.method = 'GET';
				httpparams.url = SERVER_URL + "usertype/list";
				httpparams.headers = {
						auth_token : Auth.getAuthToken()
					};
				$http(httpparams).then(function successCallback(response) {
						$scope.userTypes = response.data;

						console.log(response);

					}, function errorCallback(response) {
						console.log("Error");
					});
			    };
			    
			    $scope.getPage=function(){
			    	var httpparams = {};
					httpparams.method = 'GET';
					httpparams.url = SERVER_URL + "page/list";
					httpparams.headers = {
							auth_token : Auth.getAuthToken()
						};
					 $http(httpparams).then(function successCallback(response) {
							$scope.pages = response.data;
							console.log(response);
						}, function errorCallback(response) {
							console.log("Error");
						});
				    };
				    
				$scope.addPages = function(){
			    	console.log('Adding RM : ', $scope.userPage);
			    	if( !angular.equals($scope.userPage,{}) ){
			    		if(!$scope.isDuplicatePage($scope.userPage)){
						   $scope.userPages.push($scope.userPage);	
						   $scope.userPage = {};
						   $scope.userTypePageInformtion.page.$setValidity("message", true);
						   $scope.message="";
			    		}else{
			    			$scope.message = 'This Page is already added';
			    			console.log("else block");
			    			 $scope.userTypePageInformtion.page.$setValidity("message", false);
			    		}
					}
			    
				};    
				
				$scope.isDuplicatePage = function(userPage) {
					for (var i = 0; i < $scope.userPages.length; i++) {
						if ($scope.userPages[i].pageId === userPage.pageId) {
							return true;
						}
					}
					return false;
				};
	
});