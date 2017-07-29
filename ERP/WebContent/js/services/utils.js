erpApp.service('utils',function myutils($mdDialog, $rootScope,$mdToast,$location, $anchorScroll) {
		function hideProgressBar() {
				$rootScope.$emit("hide_wait");
		};

		function showProgressBar(id) {
			var parentElement = id ? document.getElementById(id) : document.body; 
			$mdDialog.show({
				controller : 'ProgressBarController',
				templateUrl : 'views/progressBar.html',
				parent : angular.element(document.body),
				clickOutsideToClose : false,
				fullscreen : false
			}).then(function() { });
		};
		
		function showToast(message) {
			$mdToast.show({
				hideDelay : 3000,
				position : 'top right',
				controller : 'ToastCtrl',
				templateUrl : 'views/toast.html',
				locals : {
					message : message
				}
			});
		};
		
		function getCurrentDate(){
			var currentDate = new Date();
			var curr_year = currentDate.getFullYear();
			var curr_date = currentDate.getDate() < 10 ? "0"
					+ currentDate.getDate()
					: currentDate.getDate();
			var curr_month = (currentDate.getMonth() + 1) < 10 ? ("0" + (currentDate
					.getMonth() + 1))
					: (currentDate.getMonth() + 1);
			var currentDateFormatted = curr_year + "-"
					+ curr_month + "-" + curr_date;
			return currentDateFormatted;
		}
		
		function getCurrentMonthYearString(){
			var currentDate = new Date();
			var curr_year = currentDate.getFullYear();
			var curr_date = currentDate.getDate() < 10 ? "0"
					+ currentDate.getDate()
					: currentDate.getDate();
			var curr_month = (currentDate.getMonth() + 1) < 10 ? ("0" + (currentDate
					.getMonth() + 1))
					: (currentDate.getMonth() + 1);
			var currentDateFormatted = curr_month + "-" + curr_year;
			return currentDateFormatted;
		}
		
		function scrollToTop(){
			$anchorScroll.yOffset = 50;
			$anchorScroll();
		}
		
		function showConfirm(ev){
			var confirm = $mdDialog.confirm().title('You want to back home page else same page')
			.ariaLabel('').targetEvent(ev).ok('YES' ).cancel('NO');

	$mdDialog.show(confirm)
			.then(function() {
				$location.path('/home');
			}, function() {});
		};
		
	/*	function showConfirm(message,url,yes,no){
			var confirm = $mdDialog.confirm().title(message)
			.ariaLabel('').targetEvent(ev).ok(yes ).cancel(no);

	$mdDialog.show(confirm)
			.then(function() {
				$location.path(url);
			}, function() {});
		};*/
		
		
		return {
			hideProgressBar : hideProgressBar,
			showProgressBar : showProgressBar,
			showToast : showToast,
			getCurrentDate : getCurrentDate,
			getCurrentMonthYearString : getCurrentMonthYearString,
			scrollToTop : scrollToTop,
			showConfirm : showConfirm
		};
});