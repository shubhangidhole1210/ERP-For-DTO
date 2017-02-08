erpApp.controller('qualityInspectionCtrl', function($scope, $http, $mdDialog, $mdToast, $rootScope,
		SERVER_URL) {
$scope.getRMInformation=function()
	
	{
		$http({
			method : 'GET',
			url : SERVER_URL + "rawmaterialorder/list"
		}).then(function successCallback(response) {
			$scope.rawMaterials = response.data;
			

			console.log(response);

		}, function errorCallback(response) {
			console.log("Error");

		});
	}
});
