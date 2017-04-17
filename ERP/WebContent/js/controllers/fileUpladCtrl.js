erpApp.controller('fileUplodCtrl',function($scope,$http,SERVER_URL,Auth)
{
	var formdata = new FormData();
    $scope.getTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            formdata.append(key, value);
            console.log($files);
            console.log(formdata);
        });
    };

    $scope.uploadFiles = function () {

       /* var request = {
            method: 'POST',
            url: '/api/fileupload/',
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        };
*/
    	var httpparams = {};
    	httpparams.method = 'post';
    	httpparams.url = SERVER_URL + "fileupload";
    	httpparams.data = formdata;
    	httpparams.headers = {
				auth_token : Auth.getAuthToken()
			};
    	
    	$http(httpparams)
		.then(
				function successCallback(data) {
				},
				function errorCallback(data) {
					
				});
    	
    	
    	
        /*$http(request)
            .success(function (d) {
                alert(d);
            })
            .error(function () {
            });*/
    }

});	
