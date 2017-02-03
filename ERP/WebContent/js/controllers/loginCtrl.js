erpApp.controller('loginCtrl', function($scope, $location,$rootScope, $http, Auth, SERVER_URL,utils) {
	$scope.login = function() {
		utils.showProgressBar();
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
			console.log('in login function');
			utils.hideProgressBar();
			if(data.data.code == 1){
				
				console.log(data.headers());
				console.log(data.headers('auth_token'));
				var userInfo = {};
				userInfo.auth_token = data.headers('auth_token');
				Auth.setUser(userInfo);
				$scope.$emit('loginSuccess',{});
				
				$location.path('/');
				
			}else{
				
			}
			utils.showToast(data.data.message);
		}, function errorCallback(data) {
			console.log("Error");
			utils.hideProgressBar();
			utils.showToast("We are sorry, Something went wrong. Please try again later ");
		});
	};
});
