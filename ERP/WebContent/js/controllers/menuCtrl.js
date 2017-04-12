erpApp.controller('menuController', function($scope,$rootScope,Auth,SERVER_URL,$http,$location,$animate) {
	$scope.menu = [];
	$scope.displayMenu=Auth.isLoggedIn();
	
	$scope.createCascadedMenu = function(){
		var cascadedMenu = [];
		for (var index=0; index < $scope.menu.length ; index++){
			var cascadedMenuItem = {};
			var isMenuAdded = false;
			var indexAdded = 0;
			for (var subindex=0; subindex < cascadedMenu.length ; subindex++){
				if(cascadedMenu[subindex].menu === $scope.menu[index].menu ){
					var subMenu = {};
					subMenu.submenu = $scope.menu[index].submenu;
					subMenu.url = $scope.menu[index].url;
					cascadedMenu[subindex].submenu.push(subMenu);
					isMenuAdded = true;
					indexAdded = subindex+1;
					break;
				}
			}
			if(cascadedMenu.length == 0 || !isMenuAdded){
				cascadedMenuItem.menu = $scope.menu[index].menu;
				var subMenu = {};
				cascadedMenuItem.submenu = [];
				subMenu.submenu = $scope.menu[index].submenu;
				subMenu.url = $scope.menu[index].url;
				cascadedMenuItem.submenu.push(subMenu);
				cascadedMenu.push(cascadedMenuItem);
				/*console.log('Added first cascaded menu',cascadedMenu);*/
			}
		}
		return cascadedMenu;
	};
	
	if($scope.displayMenu){
		$scope.menu = Auth.getMenu();
		$scope.cascadedMenu = $scope.createCascadedMenu();
	}
	
	$rootScope.$on('logout',function($event){
		console.log('Inside menuController logout event');
		$scope.displayMenu=Auth.isLoggedIn();
	});
	
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside menuController login success event');
		$scope.displayMenu=Auth.isLoggedIn();
		$scope.menu = Auth.getMenu();
		$scope.cascadedMenu =  $scope.createCascadedMenu();
		$scope.user = Auth.getUserName();
	});
	$scope.selectedIndex = 0;
	$scope.menuClicked=function($index)
	{
		 $scope.selectedIndex = $index;
	};
	
	
	/*var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].onclick = function() {
	    this.classList.toggle("active");
	    var panel = this.nextElementSibling;
	    if (panel.style.maxHeight){
	      panel.style.maxHeight = null;
	    } else {
	      panel.style.maxHeight = panel.scrollHeight + "px";
	    } 
	  }
	}
*/
});
