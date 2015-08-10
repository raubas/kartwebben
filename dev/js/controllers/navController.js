app.controller('navCtrl', function($scope, $location, $modal, userManagement){
	
	$scope.user = false;
	$scope.$on('userState', function (data) {
		console.log(data); 
		if (data.targetScope.sessionUser == null){
			console.log('false');
			$scope.user = false;
		}else{
			console.log('true');
			$scope.user = true;
			$scope.$apply();
		}
	});

	$scope.navClass = function (page) {
	        var currentRoute = $location.path().substring(1) || 'home';
	        console.log(currentRoute);
	        return page === currentRoute ? 'active' : '';
	};  

	$scope.logOut = function(){
		userManagement.logOut();
		console.log('utloggad');
		
	}

	$scope.logInModal = function() {
	  
	  $scope.opts = {
		  backdrop: true,
		  backdropClick: true,
		  dialogFade: false,
		  keyboard: true,
		  templateUrl : '/dev/components/loginModal.html',
		  controller : ModalInstanceCtrl,
		  resolve: {} // empty storage
	    };
	    
	  
	  $scope.opts.resolve.item = function() {
	      return angular.copy({ }); // pass name to Dialog
	  }
	  
	    var modalInstance = $modal.open($scope.opts);
	    
	    modalInstance.result.then(function(result){
	      userManagement.logIn(result.user.username, result.user.password);
	      //on ok button press 
	    },function(){
	      //on cancel button press
	      console.log("Modal Closed");
	    });
	};


});