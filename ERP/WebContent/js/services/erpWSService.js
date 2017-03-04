erpApp.service('erpWSService',function erpWSService(Auth,SERVER_URL){
	var USER_LIST = 'user/list';
	
	this.getHTTPParams = function (method, url, data, headers){
		var requestBody = {};
		
		//create your request body here and return object
		requestBody.method = method;
		requestBody.url = SERVER_URL + url;
		requestBody.headers = this.getHTTPRequestHeader();
		requestBody.data = data;
		return requestBody;
	};
	this.getHTTPRequestBody = function(){
		var data = {};
		
		return data;
	};
	this.getHTTPRequestHeader = function (){
		var headers = {
				auth_token : Auth.getAuthToken()
		};
		return headers;
	};
	
	this.getList = function(){
		
		var httpparams = this.getHTTPParams('GET',USER_LIST);
		
		$http(httpparams).then(function successCallback(data) {
				$mdDialog.hide();
				$rootScope.$emit("CallPopulateUserList", {});
				console.log(data);
				}, function errorCallback(data) {
					console.log("Error");
		});
	};
	
	
});