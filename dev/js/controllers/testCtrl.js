app.controller('testController', function($scope){

	// Queries
	$scope.doQuery = function(){
		var query = new Parse.Query("Schools");
		query.find().then(function(result){
	        $scope.schools = result;
	});
	}
	

});

