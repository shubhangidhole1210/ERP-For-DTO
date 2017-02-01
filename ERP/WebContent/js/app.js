var erpApp = angular
		.module('ERPApp', [ 'ngRoute', 'ngMaterial', 'ngMessages' ]);
erpApp.config(function($locationProvider) {
	$locationProvider.hashPrefix('');
});
erpApp.value('SERVER_URL', 'http://192.168.2.111:8080/ERP/');
erpApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'views/home.html'
	}).when('/product', {
		templateUrl : 'views/product.html'
	}).when('/home', {
		templateUrl : 'views/home.html'
	}).when('/unit', {
		templateUrl : 'views/unit.html'
	}).when('/user', {
		templateUrl : 'views/user.html'
	}).when('/vendor', {
		templateUrl : 'views/vendor.html'
	}).when('/rmInventary', {
		templateUrl : 'views/RMInventary.html'
	}).when('/rawMaterial', {
		templateUrl : 'views/rawMaterial.html'
	}).when('/rmVendorAssociation', {
		templateUrl : 'views/RMVendor.html'
	}).when('/Rmorder', {
		templateUrl : 'views/RMOrder.html'
	}).when('/finishedGood', {
		templateUrl : 'views/finishedGood.html'
	}).when('/client', {
		templateUrl : 'views/client.html'
	}).when('/productOrder', {
		templateUrl : 'views/productOrder.html'
	}).when('/productInventory', {
		templateUrl : 'views/productInventory.html'
	}).when('/productRMAssociation', {
		templateUrl : 'views/productRMAssociation.html'
	}).when('/order', {
		templateUrl : 'views/order.html'
	}).when('/administration', {	
		templateUrl : 'views/administration.html'
	}).when('/Report', {
		templateUrl : 'views/Report.html'
	}).when('/notification', {
		templateUrl : 'views/notification.html'
	}).otherwise({
		redirectTo : '/'
	});
});
/*erpApp.service('progressBar',function($mdDialog)
{

	this.showProgressBarOne= function()
	{
		$mdDialog
		.show(
				{
					controller : ProgressBarController,
					templateUrl : 'views/progressBar.html',
					parent : angular
							.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : false,
					fullscreen : $scope.customFullscreen,
					onComplete : function() {
						$scope.populateUserList(ev);
					}
					
				
				})
		.then(
				function(answer) {
					$scope.status = 'You said the information was "'
							+ answer + '".';
				},
				function() {
					$scope.status = 'You cancelled the dialog.';
				});
	};
	
	});*/

erpApp.controller('ERPController', function($scope) {
	
	$scope.isLoginButton = true;
	$scope.isuserName = false;
	$scope.displayLogin = function() {
		$scope.isLoginButton = false;
		$scope.isuserName = true;
	}
});

erpApp.controller('homectrl', function($scope, $http,SERVER_URL) {
	$http({
		method : 'GET',
		url : SERVER_URL + 'user/list'
	}).then(function successCallback(response) {
		$scope.data = response.data;
		
	}, function errorCallback(response) {
		console.log("Error");

	});

});





erpApp.controller('finshedGoodctrl', function($scope) {

});

erpApp.controller('orderCtrl', function($scope) {

});

erpApp.controller('administrationCtrl', function($scope) {

});

erpApp.controller('reportctrl', function($scope) {

});

erpApp.controller('notificationCtrl', function($scope) {

});




erpApp.controller('ToastCtrl', function($scope, $mdToast, message) {
	$scope.message = message;
	$scope.closeToast = function() {

		$mdToast.hide().then(function() {

		});
	};

});
