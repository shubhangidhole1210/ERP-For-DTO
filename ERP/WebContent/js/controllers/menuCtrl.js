erpApp.controller('menuController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location,User) {
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
		$scope.user = User;
	});
	$scope.selectedIndex = 0;
	$scope.menuClicked=function($index)
	{
		 $scope.selectedIndex = $index;
	};
});