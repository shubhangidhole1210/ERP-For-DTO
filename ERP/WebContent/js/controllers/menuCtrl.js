erpApp.controller('menuController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location,User) {
	$scope.menu = [];
	$scope.displayMenu=Auth.isLoggedIn();
	
	$scope.createCascadedMenu = function(){
		var cascadedMenu = [];
		for (var index=0; index < $scope.menu.length ; index++){
			var cascadedMenuItem = {};
			for (var subindex=0; subindex < cascadedMenu.length ; subindex++){console.log('menu subindex : '+ subindex);
				console.log('menu subindex : '+ subindex + " : " , $scope.menu[subindex].menu);
				if(cascadedMenu[subindex].menu === $scope.menu[index].menu ){
					//match found for menu
					//add submenu
					var subMenu = {};
					subMenu.submenu = $scope.menu[index].submenu;
					subMenu.url = $scope.menu[index].url;
					cascadedMenu[subindex].submenu.push(subMenu);
					break;
				}else{
					//new menu
					cascadedMenuItem.menu = $scope.menu[index].menu;
					
						var subMenu = {};
						cascadedMenuItem.submenu = [];
						subMenu.submenu = $scope.menu[index].submenu;
						subMenu.url = $scope.menu[index].url;
						cascadedMenuItem.submenu.push(subMenu);
						cascadedMenu.push(cascadedMenuItem);
				}
			}
			if(cascadedMenu.length == 0){
				cascadedMenuItem.menu = $scope.menu[index].menu;
				
					var subMenu = {};
					cascadedMenuItem.submenu = [];
					subMenu.submenu = $scope.menu[index].submenu;
					subMenu.url = $scope.menu[index].url;
					cascadedMenuItem.submenu.push(subMenu);
					cascadedMenu.push(cascadedMenuItem);
					console.log('Added first cascaded menu',cascadedMenu);
			}
		}
		return cascadedMenu;
	};
	
	if($scope.displayMenu){
		$scope.menu = Auth.getMenu();
		console.log('Menu',$scope.menu);
		$scope.cascadedMenu = $scope.createCascadedMenu();
	}
	
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayMenu=Auth.isLoggedIn();
	});
	
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayMenu=Auth.isLoggedIn();
		$scope.menu = Auth.getMenu();
		$scope.cascadedMenu =  $scope.createCascadedMenu();
		$scope.user = User;
	});
	$scope.selectedIndex = 0;
	$scope.menuClicked=function($index)
	{
		 $scope.selectedIndex = $index;
	};
	
	
	
});