erpApp.controller('productOrderDialogCtrl', function($scope,$http, $mdDialog,SERVER_URL,$rootScope,$mdToast,Auth,productOrder,utils,flag,action,information) {
	$scope.productOrder=productOrder;
    $scope.flag=flag;
    $scope.isReadOnly = action;
    $scope.information = information;
    $scope.productOrder.expecteddeliveryDate = new Date($scope.productOrder.expecteddeliveryDate);
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    
    $scope.saveProductOrder=function(ev)
    {
    	
    	var data = {
    			 orderproductassociations : $scope.orderProductAssociations,
    			 description:$scope.productOrder.description,
    			 status:$scope.productOrder.status.id,
    			 expecteddeliveryDate:$scope.productOrder.expecteddeliveryDate ,
    			  client:$scope.productOrder.client.id,
    			 createdBy:2,
    			 created_date:null,
    			 updatedBy:1,
    			 updated_date:null,
    			 isactive:true
				
		};
		var httpparams = {};
		if ($scope.flag == 0) {
			console.log($scope.productOrder);
			console.log($scope.data);
			httpparams.method = 'post';
			httpparams.url = SERVER_URL + "productorder/createmultiple";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		} else {
			 data.id=$scope.productOrder.id;
			httpparams.method = 'put';
			httpparams.url = SERVER_URL + "productorder/update";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		}
		
		httpparams.data = data;
		$http(httpparams)
				.then(
						function successCallback(data) {
							$mdDialog.hide();
							console.log(data);
							if(data.data.code === 0){
								console.log(data.data.message);
								$rootScope.$emit(
										"saveRMOrderError", {});
								console.log(data);
								$scope.hide();
								utils.showToast('Something went worng. Please try again later.');
							}else{
								$scope.displayProgressBar = false;
								utils.showToast('Product Order Created successfully.');
								$rootScope.$emit("callPopulateProductOrderList",{});
							}
						},
						function errorCallback(data) {
							$rootScope.$emit(
									"saveRMOrderError", {});
							console.log(data);
							$scope.hide();
							utils.showToast('Something went worng. Please try again later.');
						});
    	
    	 
    }
    
  
	
	
	$scope.submitInformation = function(isvaliduser,$event) {
		if (isvaliduser) {
			
			$scope.saveProductOrder($event);
		} else {
			console.log('its else block');
		}

	}
    
   
	
	 $scope.getProducts=function()
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
	    };
	 $scope.getStatus=function()
	    {
		 var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "status/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		 $http(httpparams).then(function successCallback(response) {
				$scope.statusData = response.data;

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			});
	    };
	    
	    $scope.getClient=function(){
	    	var httpparams = {};
			httpparams.method = 'GET';
			httpparams.url = SERVER_URL + "client/list";
			httpparams.headers = {
					auth_token : Auth.getAuthToken()
				};
		 $http(httpparams).then(function successCallback(response) {
				$scope.clients = response.data;

				console.log(response);

			}, function errorCallback(response) {
				console.log("Error");

			});
	    };
	    
    
	    
	    $scope.orderProductAssociations=[];
	    $scope.orderProductAssociation={isActive : true};
	    $scope.addOrderProductAssociation=function(){
	    	if(!angular.equals($scope.orderProductAssociation,{})){
				   $scope.orderProductAssociations.push($scope.orderProductAssociation);	
				   $scope.orderProductAssociation = {isActive : true};
				   console.log($scope.orderProductAssociations);
			}
	    };
});