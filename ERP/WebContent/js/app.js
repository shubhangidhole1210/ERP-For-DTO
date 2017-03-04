var erpApp = angular
		.module('ERPApp', [ 'ngRoute', 'ngMaterial', 'ngMessages' ]);
erpApp.config(function($locationProvider) {
	$locationProvider.hashPrefix('');
});

/*erpApp.factory('httpRequestInterceptor', function (Auth) {
	  return {
	    request: function (config) {
	    	console.log(Auth.getAuthToken());
	    	if( Auth.getAuthToken()){
	    		config.headers['auth_token'] = Auth.getAuthToken();
	    		
	    	}
	      config.headers['Accept'] = 'application/json;odata=verbose';
	    	
	    	return config;
	    }
	  };
	});

erpApp.config(function ($httpProvider) {
	  $httpProvider.interceptors.push('httpRequestInterceptor');
});*/
erpApp.value('SERVER_URL', 'http://192.168.2.109:8080/ERP/');
erpApp.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'views/home.html',
		data : {
			loginRequired : true
		}
	}).when('/product', {
		templateUrl : 'views/product.html',
		data : {
			loginRequired : true
		}
	}).when('/userType', {
		templateUrl : 'views/userType.html',
		data : {
			loginRequired : true
		}
	}).when('/home', {
		templateUrl : 'views/home.html',
			data : {
				loginRequired : true
			}
	}).when('/login', {
		templateUrl : 'views/login.html'
	}).when('/unit', {
		templateUrl : 'views/unit.html',
		data : {
			loginRequired : true
		}
	}).when('/user', {
		templateUrl : 'views/user.html',
		data : {
			loginRequired : true,
			
		}
	
		
	}).when('/vendor', {
		templateUrl : 'views/vendor.html',
		data : {
			loginRequired : true
		}
	}).when('/rmInventary', {
		templateUrl : 'views/RMInventary.html',
		data : {
			loginRequired : true
		}
	}).when('/rawMaterial', {
		templateUrl : 'views/rawMaterial.html',
		data : {
			loginRequired : true
		}
	}).when('/rmVendorAssociation', {
		templateUrl : 'views/RMVendor.html',
		data : {
			loginRequired : true
		}
	}).when('/rmOrder', {
		templateUrl : 'views/RMOrder.html',
		data : {
			loginRequired : true
		}
	}).when('/userTypeAsso', {
		templateUrl : 'views/userPageTypeAsso.html',
		data : {
			loginRequired : true
		}
	}).when('/client', {
		templateUrl : 'views/client.html',
		data : {
			loginRequired : true
		}
	}).when('/productOrder', {
		templateUrl : 'views/productOrder.html',
		data : {
			loginRequired : true
		}
	}).when('/productInventory', {
		templateUrl : 'views/productInventory.html',
		data : {
			loginRequired : true
		}
	}).when('/productRMAssociation', {
		templateUrl : 'views/productRMAssociation.html',
		data : {
			loginRequired : true
		}
	}).when('/order', {
		templateUrl : 'views/order.html',
		data : {
			loginRequired : true
		}
	}).when('/unAuthorized', {	
		templateUrl : 'views/unAuthorized.html',
		data : {
			loginRequired : true
		}
	}).when('/securityCheck', {
		templateUrl : 'views/securityInformation.html',
		data : {
			loginRequired : true
		}
	}).when('/qualityCheck', {
		templateUrl : 'views/qualityInspection.html',
		data : {
			loginRequired : true
		}
	}).when('/productionPlan', {
		templateUrl : 'views/productionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/productionPlan', {
		templateUrl : 'views/productionPlan.html',
		data : {
			loginRequired : true
		}
	}).when('/status', {
		templateUrl : 'views/status.html',
		data : {
			loginRequired : true
		}
	}).when('/notFound', {
		templateUrl : 'views/notFound.html',
	}).otherwise({
		redirectTo : '/notFound'
	});
	
});
erpApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event,next) {

    	 if (next !== undefined) {
 	        if ('data' in next) {
 	            if ('loginRequired' in next.data ) {
 	                var loginRequired = next.data.loginRequired;
 	                console.log('loginRequired = ' + loginRequired);
 	                if(!Auth.isLoggedIn() && loginRequired){
 	                	$location.path('/login');
 	                 }/*else if(next.$$route.originalPath !=='/' && !Auth.isPageAccessible(next)){
 	                	 console.log('page is not accessible');
 	                	$location.path('/unAuthorized');
 	                 }*/else{
 	                	 //do nothing
 	                 }
 	            }
 	        }
 	    }
    });
}]);



erpApp.factory('Auth', function(){
	var user;

	return{
	    setUser : function(aUser){
	        user = aUser;
        	sessionStorage.user =JSON.stringify(user);
        	console.log('setting sessionstorage : '+ sessionStorage.user);
	    },
	    setMenu : function(menu){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	user.menu = menu;
	    	sessionStorage.user =JSON.stringify(user);
	    },
	    isLoggedIn : function(){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	        return (user)? true : false;
	    },
	    getAuthToken : function(){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	        return user.auth_token;
	    },
	    getMenu : function(){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	return user.menu;
	    },
	    isPageAccessible : function(next){
	    	if(!user && sessionStorage.user){
	    		user = JSON.parse(sessionStorage.user);
	    	}
	    	var index = 0;
	    	var isPageAccessible = false;
	    	for(index = 0; index<user.menu.length;index++){
	    		if(user.menu[index].url == next.$$route.originalPath){
	    			isPageAccessible = true;
	    		}
	    	}
	    	return isPageAccessible;
	    }
	  }
	});

erpApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

erpApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);

/*erpApp.controller('ERPController', function($scope,$rootScope,Auth,SERVER_URL,$http) {
	
	$scope.isLoginButton = true;
	$scope.isuserName = false;
	$scope.displayLogin = function() {
		$scope.isLoginButton = false;
		$scope.isuserName = true;
	}
	$scope.menu = [];
	$scope.displayMenu=Auth.isLoggedIn();
	if($scope.displayMenu){
		$scope.menu = Auth.getMenu();
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayMenu=Auth.isLoggedIn();
	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayMenu=Auth.isLoggedIn();
		$scope.menu = Auth.getMenu();
	});
	
	$scope.logginButton=[];
	$scope.displayLoginButton=Auth.isLoggedIn();
	if($scope.displayLoginButton){
		$scope.logginButton = Auth.getMenu();
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.displayLoginButton=Auth.isLoggedIn();
	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.displayLoginButton=Auth.isLoggedIn();
		$scope.logginButton = Auth.getMenu();
	});
	
	$scope.userID=[];
	$scope.isUserName=Auth.isLoggedIn();
	if($scope.isUserName){
		$scope.userID = Auth.getMenu();
	}
	$rootScope.$on('logout',function($event){
		console.log('Inside logout event');
		$scope.isUserName=Auth.isLoggedIn();
	});
	$rootScope.$on('loginSuccess',function($event){
		console.log('Inside login success event');
		$scope.isUserName=Auth.isLoggedIn();
		$scope.userID = Auth.getMenu();
	});
	
	$rootScope.$on("CallUserProfileList", function($event,$index,Auth) {
		$scope.getUserProfile();
	});
	
	$scope.getUserProfile=function(index)
	{
		
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "user/userProfile/"+ $scope.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
		$scope.userProfile = response.data;
         
		console.log('user profile list' +response);
		
         console.log($scope.rawMaterialList)
	}, function errorCallback(response) {
		console.log("Error");

	});
	}
	

	
	
});*/



erpApp.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);

erpApp.directive('lettersOnly', function() {
	  return {
		    replace: true,
		    template: '<input replace="[^a-zA-Z]" with="">'
		  };
		})

erpApp.controller('finshedGoodctrl', function($scope) {

});

erpApp.controller('orderCtrl', function($scope) {

});

erpApp.controller('administrationCtrl', function($scope) {

});


erpApp.controller('notificationCtrl', function($scope) {

});

erpApp.controller('pageCtrl', function($scope) {

});


erpApp.controller('ToastCtrl', function($scope, $mdToast, message) {
	$scope.message = message;
	$scope.closeToast = function() {
		$mdToast.hide().then(function() {

		});
	};

});
