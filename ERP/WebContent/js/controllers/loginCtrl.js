erpApp.controller('loginCtrl', function($scope,$location,$http,Auth,SERVER_URL) {
	  $scope.login=function()
	  {
			var data = {

					userid : $scope.userid,
					password : $scope.password
					
				}
		  $http({
				method : 'post',
				url : SERVER_URL + 'user/login',
				data : data
			}).then(function successCallback(data) {
				console.log(data);
			}, function errorCallback(data) {
				console.log("Error");

			});
		  
		  
	  console.log('in login function')
		  var data = {
			  username : '',
			  password : ''
		  };
		  Auth.setUser(data); 
		  $location.path('/');
		  
		
	  }
	   
	});
