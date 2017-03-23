erpApp.controller('mainViewController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location,User) {
	console.log('mainViewController');
	$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
		$rootScope.$on('logout',function($event){
			$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
		});
		$rootScope.$on('loginSuccess',function($event){
			$scope.mainClass = Auth.isLoggedIn() ? 'main-class' : 'main-class-full-screen';
		});
});

erpApp.controller('ERPController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location,User) {
	$scope.displayButton = [];
	$scope.userId= [];
	$scope.displayLoginButton=Auth.isLoggedIn();
	$scope.displayUserName=Auth.isLoggedIn();
	
	
	if($scope.displayLoginButton){
		$scope.displayButton = Auth.getLogginButton();
	}
	
	
	if($scope.displayUserName){
		$scope.userId = Auth.getLogginButton();
	}
	
	
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		
		$scope.displayLoginButton=Auth.isLoggedIn();
		
		$scope.displayUserName=Auth.isLoggedIn();
		$location.path('/login');
	});
	
	
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.user = User;
		$scope.displayUserName=Auth.isLoggedIn();
		$scope.displayLoginButton=Auth.isLoggedIn();
		$scope.displayButton = Auth.getLogginButton();
		$scope.userId = Auth.getUserName();
	});
	
	/*$scope.userId= [];
	$scope.displayUserName=Auth.isLoggedIn();
	if($scope.displayUserName)
		{
		    $scope.userId = Auth.getUserName();
		}
	
	$rootScope.$on('logout',function($event){
		$scope.displayUserName=Auth.isLoggedIn();
		$location.path('/login');
	});
	
	$rootScope.$on('loginSuccess',function($event){
		$scope.user = User;
		$scope.displayUserName=Auth.isLoggedIn();
		$scope.userId = Auth.getUserName();
	});
	
	*/
	

	
	
	
$scope.logOut=function()
{
	Auth.logout();
	$rootScope.$emit("logout",{});
};
});