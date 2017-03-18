erpApp.controller('ERPController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location,User) {
	
	/*$scope.menu = [];
	$scope.displayMenu=Auth.isLoggedIn();*/
	/*$scope.displayUserName = Auth.isLoggedIn();*/
	/*if($scope.displayMenu){
		$scope.menu = Auth.getMenu();
	}*/
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
//		$scope.displayMenu=Auth.isLoggedIn();
		/*$scope.displayUserName = Auth.isLoggedIn();*/
		$scope.displayLoginButton = Auth.isLoggedIn();
		/*$scope.displayUserName=Auth.isLoggedIn();*/
		console.log('logging out');
		$location.path('/login');

	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
//		$scope.displayMenu=Auth.isLoggedIn();
		/*$scope.displayUserName = Auth.isLoggedIn();*/
		/*$scope.displayUserName=Auth.isLoggedIn();*/
//		$scope.menu = Auth.getMenu();
		$scope.user = User;
		
	});
	
	$scope.logginButton=[];
	$scope.displayLoginButton=Auth.isLoggedIn();
	if($scope.displayLoginButton){
		$scope.logginButton = Auth.getMenu();
	
	}
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayLoginButton=Auth.isLoggedIn();
		$scope.logginButton = Auth.getMenu();
		
	});
	
	$scope.userId=[];
	$scope.displayUserName=Auth.isLoggedIn();
	if($scope.displayUserName){
		$scope.userId=Auth.getMenu();
	}
		
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayUserName=Auth.isLoggedIn();
		$scope.userId = Auth.getMenu();
		
	});
	
	
	
	
	/*$scope.userID=[];
	$scope.isUserName=Auth.isLoggedIn();
	if($scope.isUserName){
		$scope.userID = Auth.getMenu();
	}*/
	
	$rootScope.$on("CallUserProfileList", function($event,$index) {
		$scope.getUserProfile();
	});
	
	$scope.getUserProfile=function(index)
	{
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "user/userProfile/"+ $scope.userid;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.userProfile = response.data;
			console.log(response);
		    console.log($scope.rawMaterialList)
		}, function errorCallback(response) {
			console.log("Error");
		});
	};
	
$scope.logOut=function()
{
	Auth.logout();
	$rootScope.$emit("logout",{});
};
/*$scope.selectedIndex = 0;
$scope.menuClicked=function($index)
{
	 $scope.selectedIndex = $index;
};*/
	
});