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
	
	/*$scope.getPdf = function(){
		
		 var httpparams = {};
         httpparams.method = 'GET';
         httpparams.url = SERVER_URL + "bom/downloadBomPdf/1/7";
        httpparams.headers = {
		      auth_token : Auth.getAuthToken()
	        };
        
		$http(httpparams).then( function successCallback(response,data, status, headers, config) {
					console.log(response);
					console.log(response.data);
					utils.hideProgressBar();
					 var anchor = angular.element('<a/>');
				     anchor.attr({
				         href: 'data:attachment/pdf;charset=utf-8,' +  encodeURIComponent(response.data),
				         target: 'blank',
				         download: 'ProductOrder.pdf'
				     })[0].click();
				})
		 function errorCallback(response,data, status, headers, config){
			
		}
	}*/
	
	
	
	$scope.getPdf = function () {
		
		var httpparams = {};
		httpparams.method = 'GET';
		httpparams.url = SERVER_URL + "bom/downloadBomPdf/" +$scope.product.product.id + "/" +$scope.bom.id;
		httpparams.responseType = 'arraybuffer';
		httpparams.headers = {
			      auth_token : Auth.getAuthToken()
		        };
		$http(httpparams).then( function successCallback(response,data, status, headers){
			console.log(response.headers);
	        headers = response.headers();
	        var filename = "ProductOrder.pdf";
	        var filename = headers['ProductOrder.pdf'];
	        var contentType = headers['content-type'];
	        console.log("file name:-" + filename)
	        var linkElement = document.createElement('a');
	        try {
	            var blob = new Blob([response.data], { type: contentType });
	            var url = window.URL.createObjectURL(blob);
	 
	            linkElement.setAttribute('href', url);
	            linkElement.setAttribute("download", 'ProductOrder.pdf');
	 
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
	    
	};
	
	
	
	
	
	
	
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