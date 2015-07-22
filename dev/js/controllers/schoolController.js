

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
	    });

 		$scope.saveSchool = function(school){

 			var Schools = Parse.Object.extend("Schools");
			var school = new Schools();
			school.set("name", school.name)
 		}

 		$scope.addArea = function(area){
 			for (var i = $scope.addedAreas.length - 1; i >= 0; i--) {
 				if ($scope.addedAreas[i] == area) {
 					$scope.error = "Du har redan lagt till detta område";
 					return;
 				}	
 			};
 			$scope.addedAreas.push(area); 
 			console.log($scope.addedAreas);
 		}

 		$scope.setCurrentArea = function(area){
 			console.log(area);
 			$scope.currentArea = area
 		}


});