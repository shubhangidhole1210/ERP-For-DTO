erpApp.controller('productionPlanCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,
		SERVER_URL,Auth) {
	$scope.today = new Date();
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
	$scope.seventh_day_date.setDate($scope.seventh_day_date.getDate() + 6);
	
	
	
	/*$scope.today= new Date();
	$scope.endDate = new Date(1,3,2017);
	while($scope.today <= $scope.endDate)
		{
		today = new Date(today.setDate(today.getDate()+1));
		console.log($scope.today.getDate());
		}*/
	
/*	$scope.getProductList=function()
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
		
	}*/
	
	
	
	/*var currentDate = new Date();
	  function formatDate(d)
	  {
		  var curr_date = d.getDate();
		  var curr_month = d.getMonth() + 1; //Months are zero based
		  var curr_year = d.getFullYear();
		  var currentDate = curr_date + "-" + curr_month + "-" + curr_year;
		  console.log(currentDate); 
		  return currentDate;
	  }


	var monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

	var alldays=[];
	while(monthStart.getMonth()===currentDate.getMonth())
		{
		alldays.push(formatDate(new Date(monthStart)));
		monthStart.setDate(monthStart.getDate() + 1);
		}
		console.log(alldays);*/
	
	var currentDate = new Date();
	  function formatDate(d)
	  {
		  var curr_date = d.getDate();
		  var curr_month = d.getMonth() + 1; //Months are zero based
		  var curr_year = d.getFullYear();
		  var currentDate = curr_date + "-" + curr_month + "-" + curr_year;
		  console.log(currentDate); 
		  return currentDate;
	  }


	var monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

	var alldays=[];
	while(monthStart.getMonth()===currentDate.getMonth())
		{
		alldays.push(formatDate(new Date(monthStart)));
		monthStart.setDate(monthStart.getDate() + 1);
		}
		console.log(alldays);
	
	
	$scope.getProductList=function()
	{
		
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "product/list";
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http.get('productionPlan.json').then(function successCallback(response) {
			$scope.products = response.data;
			console.log(response);
		}, function errorCallback(response) {
			console.log("Error");

		});
		
	}
	
});