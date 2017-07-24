erpApp.controller('loginCtrl', function($scope, $location,$rootScope, $http, Auth, SERVER_URL,utils) {
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
			console.log($scope.userid);
			if(data.data.code == 1){
				/*console.log(data.headers());
				console.log(data.headers('auth_token'));*/
				var userInfo = {};
				userInfo.auth_token = data.headers('auth_token');
				userInfo.user = data.data.user.userid;
				Auth.setUser(userInfo);
				Auth.setMenu(data.data.data.pages);
				Auth.setReport(data.data.data.reports);
				$scope.$emit('loginSuccess',{});
				$rootScope.$emit("CallUserProfileList",{});
				$rootScope.$emit("ReportList",{});
				$location.path('/');
			}else{
				console.log('Login has different code');
			}
			if(data.data.message!=='User logged in Successfully !'){
				$scope.message = data.data.message;
				$scope.loginForm.userName.$setValidity("apierror", false);
				$scope.loginForm.password.$setValidity("apierror", false);
			}
			utils.showToast(data.data.message);
		}, function errorCallback(data) {
			console.log("Error",data);
			utils.hideProgressBar();
			utils.showToast("We are sorry, Something went wrong. Please try again later ");
		});
	};
	
	$scope.submitLogin = function(isvaliduser) {
		if (isvaliduser) {
			utils.showProgressBar();
			$scope.login();
		} else {
			console.log('User Form is not valid');
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
