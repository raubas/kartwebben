

app.controller('schoolCtrl', function($scope){

	var query = new Parse.Query("Schools");
		query.include("contactPerson","areas", "areas.maps");
		query.find().then(function(result){
	        $scope.schools = result;
	    });


	// var queryContact = new Parse.Query("ContactPerson");
	// 	queryContact.include('ContactPerson');
	// 	queryContact.find().then(function(result){
	//         $scope.contactPerson = result;
	//     });

	// // Queries
	// $scope.doQuery = function(){
	// 	var query = new Parse.Query("Schools");
	// 	query.find().then(function(result){
	//         $scope.schools = result;
	// });
	// }
	

});

app.controller('addSchoolCtrl',

 	function addSchoolCtrl($scope){
 		$scope.addedAreas = [];
 		$scope.error = ""; 
 		var query = new Parse.Query("Areas");
		query.find().then(function(result){
	        $scope.areas = result;
	        console.log($scope.areas);
	    });

 		$scope.saveSchool = function(school){

 			var Schools = Parse.Object.extend("Schools");
			var newSchool = new Schools();
			newSchool.set("name", school.name)
			newSchool.set("areas", school.areas)
 		}

});