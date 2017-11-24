app.controller('navCtrl', function($scope, $location, $modal, userManagement){
	
	$scope.user = false;
	$scope.$on('stateChange', function () {
		var currentUser = userManagement.userState();
		if (currentUser) {
			$scope.user = true;
		}else{
			$scope.user = false;
		}
	});

	$scope.isActive = function(viewLocation) { 
	  	var location = $location.path();
			location = location.substring(1);
			location = location.replace("/",".");
	  	return viewLocation === location;
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
		  templateUrl : '/components/loginModal.html',
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