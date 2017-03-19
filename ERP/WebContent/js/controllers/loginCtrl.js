erpApp.controller('loginCtrl', function($scope, $location,$rootScope, $http, Auth, SERVER_URL,utils,User) {
	$scope.login = function(index) {
		var data = {
			userid : $scope.userid,
			password : $scope.password
		};
		$http({
			method : 'post',
			url : SERVER_URL + 'user/login',
			data : data
		}).then(function successCallback(data, headers) {
			console.log(data);
			
			utils.hideProgressBar();
			console.log($scope.userid)
			if(data.data.code == 1){
				
				console.log(data.headers());
				console.log(data.headers('auth_token'));
				var userInfo = {};
				userInfo.auth_token = data.headers('auth_token');
				Auth.setUser(userInfo);
				Auth.setMenu(data.data.data);
				$scope.$emit('loginSuccess',{});
				$rootScope.$emit("CallUserProfileList",{});
				$location.path('/');
				
			}else{
				
			}
			if(data.data.message!=='User added Successfully !')
				{
				$scope.message = data.data.message;
				$scope.loginForm.userName.$setValidity("apierror", false);
				$scope.loginForm.password.$setValidity("apierror", false);
				}
			utils.showToast(data.data.message);
		}, function errorCallback(data) {
			console.log("Error");
			utils.hideProgressBar();
			utils.showToast("We are sorry, Something went wrong. Please try again later ");
		});
	     console.log($scope.userid);
		 $scope.user = User;
		 $scope.user.userid = $scope.userid;
	     console.log($scope.user.userid);
		
	};
	
	$scope.submitLogin = function(isvaliduser) {
		if (isvaliduser) {
			utils.showProgressBar();
			$scope.login();
		} else {
			console.log('its else block');
		}

	};
	
	$scope.onUserIdChange = function(){
		$scope.loginForm.userName.$setValidity("apierror", true);
		$scope.loginForm.password.$setValidity("apierror", true);
	};
	
	$scope.onPasswordChange = function(){
		$scope.loginForm.userName.$setValidity("apierror", true);
		$scope.loginForm.password.$setValidity("apierror", true);
	};
	
});
