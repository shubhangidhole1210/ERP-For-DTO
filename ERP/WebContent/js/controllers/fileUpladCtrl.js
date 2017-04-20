erpApp.controller('fileUplodCtrl',function($scope,$http,SERVER_URL,Auth)
{
	var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            formdata.append('file', value);
            console.log($files);
            console.log(formdata);
        });
    };

    $scope.uploadFiles = function () {

    
    	var httpparams = {};
    	httpparams.method = 'post';
    	httpparams.url = SERVER_URL + "fileupload";
    	httpparams.data = formdata;
    	httpparams.headers = {
    			"Content-Type" : undefined,
				auth_token : Auth.getAuthToken()
			};
    	httpparams.transformRequest = angular.identity;
    	httpparams.withCredentials = false;
    	$http(httpparams)
		.then(
				function successCallback(response) {
					console.log(response);
				},
				function errorCallback(response) {
					console.log(error)
				});
    	

    }

});	
