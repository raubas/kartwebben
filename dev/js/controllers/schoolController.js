

app.controller('schoolCtrl', function($scope){

	var query = new Parse.Query("Schools");
		query.include('ContactPerson');
		query.find().then(function(result){
	        $scope.schools = result;
	    });

	var queryContact = new Parse.Query("ContactPerson");
		queryContact.include('ContactPerson');
		queryContact.find().then(function(result){
	        $scope.contactPerson = result;
	    });

	// // Queries
	// $scope.doQuery = function(){
	// 	var query = new Parse.Query("Schools");
	// 	query.find().then(function(result){
	//         $scope.schools = result;
	// });
	// }
	

});

app.controller('addSchoolCtrl', function($scope){

	// Queries
	$scope.doQuery = function(){
		var query = new Parse.Query("Schools");
		query.find().then(function(result){
	        $scope.schools = result;
	});
	}
	

});