erpApp.controller('fileUplodCtrl',function($scope,$http,SERVER_URL,Auth)
{
	/* $scope.uploadme;

	    $scope.uploadImage = function() {
	      var fd = new FormData();
	      var imgBlob = dataURItoBlob($scope.uploadme);
	      fd.append('file', imgBlob);
	      $http.post(
	    		  SERVER_URL + "fileupload",
	          fd, {
	            transformRequest: angular.identity,
	            headers: {
	              'Content-Type': undefined
	            }
	          }
	        )
	        .success(function(response) {
	          console.log('success', response);
	        })
	        .error(function(response) {
	          console.log('error', response);
	        });
	    }


	    //you need this function to convert the dataURI
	    function dataURItoBlob(dataURI) {
	      var binary = atob(dataURI.split(',')[1]);
	      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	      var array = [];
	      for (var i = 0; i < binary.length; i++) {
	        array.push(binary.charCodeAt(i));
	      }
	      return new Blob([new Uint8Array(array)], {
	        type: mimeString
	      });
	    }
*/
	
	
	
	
	
	
	
	
});	
