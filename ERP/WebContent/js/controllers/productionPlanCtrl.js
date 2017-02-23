erpApp.controller('productionPlanCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,
		SERVER_URL,$filter) {
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
});