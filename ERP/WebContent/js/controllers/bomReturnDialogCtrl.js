erpApp.controller('bomReturnDialogueController', function($scope, $http, $mdDialog, $mdToast, $rootScope,SERVER_URL,Auth,utils){
		
	
	$scope.getProducts = function() {
		utils.showProgressBar();
		        var httpparams = {};
		         httpparams.method = 'GET';
		         httpparams.url = SERVER_URL + "productRMAsso/list";
		        httpparams.headers = {
				      auth_token : Auth.getAuthToken()
			        };
		
					$http(httpparams).then( function successCallback(response) {
								$scope.products = response.data;
								console.log(response);
								utils.hideProgressBar();
							},
							function errorCallback(response) {
								console.log("Error");
								utils.showToast('We are Sorry. Something went wrong. Please try again later.');
								utils.hideProgressBar();
			});
	};
	
	$scope.getBomInformation = function(){
		console.log($scope.rawMaterials);
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/bomList/" + $scope.product.product.id;
		httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
		
		$http(httpparams).then(function successCallback(response) {
			$scope.bomData = response.data;
			console.log(response);
             utils.hideProgressBar();
		}, function errorCallback(response) {
			console.log("Error");
			utils.hideProgressBar();

		});
		utils.showProgressBar();
	}
	
	/*$scope.getPdf = function(event){
		console.log("in get pdf function");

		utils.showProgressBar();
		        var httpparams = {};
		         httpparams.method = 'GET';
		         httpparams.url = SERVER_URL + "bom/list";
		        httpparams.headers = {
				      auth_token : Auth.getAuthToken()
			        };
		
					$http(httpparams).then( function successCallback(response) {
								console.log(response);
								utils.hideProgressBar();
							},
							function errorCallback(response) {
								console.log("Error");
								utils.showToast('We are Sorry. Something went wrong. Please try again later.');
								utils.hideProgressBar();
			});
	
		
	}*/
	
	$scope.getPdf = function(){
		
		 var httpparams = {};
         httpparams.method = 'GET';
         httpparams.url = SERVER_URL + "bom/list";
        httpparams.headers = {
		      auth_token : Auth.getAuthToken()
	        };
        
        responseType:'arraybuffer',
		$http(httpparams).then( function successCallback(response,data, status, headers, config) {
					console.log(response);
					utils.hideProgressBar();
					 var anchor = angular.element('<a/>');
				     anchor.attr({
				         href: 'data:attachment/pdf;charset=utf-8,' + encodeURI(data),
				         target: '_blank',
				         download: 'ProductOrder.pdf'
				     })[0].click();
				})
				/*function errorCallback(response) {
					console.log("Error");
					utils.showToast('We are Sorry. Something went wrong. Please try again later.');
					utils.hideProgressBar();
					
}*/
		 function errorCallback(response,data, status, headers, config){
			
		}
	}
	
	
	
	/*$scope.getPdf = function () {
		
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/list";
		httpparams.responseType = 'arraybuffer';
		httpparams.headers = {
			      auth_token : Auth.getAuthToken()
		        };
		$http(httpparams).then( function successCallback(response,data, status, headers){
	        headers = headers();
	 
	        var filename = headers['x-filename'];
	        var contentType = headers['content-type'];
	 
	        var linkElement = document.createElement('a');
	        try {
	            var blob = new Blob([data], { type: contentType });
	            var url = window.URL.createObjectURL(blob);
	 
	            linkElement.setAttribute('href', url);
	            linkElement.setAttribute("download", filename);
	 
	            var clickEvent = new MouseEvent("click", {
	                "view": window,
	                "bubbles": true,
	                "cancelable": false
	            });
	            linkElement.dispatchEvent(clickEvent);
	        } catch (ex) {
	            console.log(ex);
	        }
		},   
		function errorCallback(response) {
			console.log("Error");
			utils.showToast('We are Sorry. Something went wrong. Please try again later.');
			utils.hideProgressBar();
	    });
	    
	};*/
	
	
	
	
	
	
	
	  $scope.cancel = function() {
	      $mdDialog.cancel(); 
	      $mdDialog.hide();
	  };

	  $scope.answer = function(answer) {
		  console.log("in answer function");
	      $mdDialog.hide(answer);
	      $mdDialog.cancel(); 
	  };
	
	  $scope.hide = function() {
	      $mdDialog.hide();
	  };

	
});