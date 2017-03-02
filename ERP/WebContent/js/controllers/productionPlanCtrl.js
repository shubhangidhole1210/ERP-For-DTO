erpApp.controller('productionPlanCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,
		SERVER_URL,Auth) {
	/*$scope.today = new Date();
	$scope.tomorrow = new Date();
	$scope.day_after_tomorrow = new Date();
	$scope.fourt_day_date = new Date();
		$scope.fifth_day_date = new Date();
		$scope.sixth_day_date = new Date();
		$scope.seventh_day_date = new Date();
	$scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);
	$scope.day_after_tomorrow.setDate($scope.day_after_tomorrow.getDate() + 2);
	$scope.fourt_day_date.setDate($scope.fourt_day_date.getDate() + 3);
	$scope.fifth_day_date.setDate($scope.fifth_day_date.getDate() + 4);
	$scope.sixth_day_date.setDate($scope.sixth_day_date.getDate() + 5);
	$scope.seventh_day_date.setDate($scope.seventh_day_date.getDate() + 6);*/

	$scope.currentDate= new Date();
	  console.log('todays date' + $scope.currentDate)
	$scope.monthStart = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), 1);
        console.log('monthStart' + $scope.monthStart)
	$scope.alldays=[];
	while($scope.monthStart.getMonth()===$scope.currentDate.getMonth())
		{
		$scope.alldays.push(new Date($scope.monthStart));
		$scope.monthStart.setDate($scope.monthStart.getDate() + 1);
		}
		console.log('all days are' + $scope.alldays);
	
	
	$scope.getProductList=function()
	{
		
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "product/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.products = response.data;
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");

		});
		
	}
	
});