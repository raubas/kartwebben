app.controller('loginCtrl', function($scope){

	$scope.user = { username: '',
					password: ''};
	$scope.logIn = function(){
		console.log($scope.user);
		Parse.User.logIn($scope.user.username, $scope.user.password, {
		  success: function(user) {
		    // Do stuff after successful login.
		    console.log('login!');
		  },
		  error: function(user, error) {
		    // The login failed. Check error to see why.
		    console.log('ojoj!');
		  }
		});
	}
	

});

