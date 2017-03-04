erpApp.controller('ERPController', function($scope,$rootScope,Auth,SERVER_URL,$http) {
	
	/*$scope.isLoginButton = true;
	$scope.isuserName = false;
	$scope.displayLogin = function() {
		$scope.isLoginButton = false;
		$scope.isuserName = true;
	}*/
	$scope.menu = [];
	$scope.displayMenu=Auth.isLoggedIn();
	if($scope.displayMenu){
		$scope.menu = Auth.getMenu();
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayMenu=Auth.isLoggedIn();
	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayMenu=Auth.isLoggedIn();
		$scope.menu = Auth.getMenu();
	});
	
	$scope.logginButton=[];
	$scope.displayLoginButton=Auth.isLoggedIn();
	if($scope.displayLoginButton){
		$scope.logginButton = Auth.getMenu();
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayLoginButton=Auth.isLoggedIn();
	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayLoginButton=Auth.isLoggedIn();
		$scope.logginButton = Auth.getMenu();
	});
	
	$scope.userID=[];
	$scope.isUserName=Auth.isLoggedIn();
	if($scope.isUserName){
		$scope.userID = Auth.getMenu();
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.isUserName=Auth.isLoggedIn();
	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.isUserName=Auth.isLoggedIn();
		$scope.userID = Auth.getMenu();
	});
	
	$rootScope.$on("CallUserProfileList", function($event,$index) {
		$scope.getUserProfile();
	});
	
	$scope.getUserProfile=function(index)
	{
		
		/*var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "user/userProfile/"+ $scope.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
		$scope.userProfile = response.data;
         
		console.log('user profile list' +response);
		
         console.log($scope.rawMaterialList)
	}, function errorCallback(response) {
		console.log("Error");

	});*/

		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "user/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {

							$scope.data = response.data;
							$scope.users = response.data;
							
							console.log(response);
							
						},
						function errorCallback(response) {
						
							
							console.log("Error");
							

						});
	}
	

	
	
});