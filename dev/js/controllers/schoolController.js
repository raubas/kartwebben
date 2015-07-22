

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
 		query.include("maps");
		query.find().then(function(result){
	        $scope.areas = result;
	        console.log($scope.areas);
	    });

 		$scope.saveSchool = function(school, contactPerson, newSchoolForm){
 			if (newSchoolForm.$valid) {
 				var Schools = Parse.Object.extend("Schools");
 				var ContactPerson = Parse.Object.extend("ContactPerson");

 				var newContactPerson = new ContactPerson();
 				newContactPerson.set("name", contactPerson.name);
 				newContactPerson.set("phoneNumber", contactPerson.phoneNumber);
 				newContactPerson.set("email", contactPerson.email);

				var newSchool = new Schools();
				newSchool.set("name", school.name);
				newSchool.set("areas", school.areas);
				newSchool.set("contactPerson", newContactPerson);
				newSchool.save(null, {
				  success: function(newSchool) {
				    // Execute any logic that should take place after the object is saved.

				    alert('New object created with objectId: ' + newSchool.id);
				    $scope.school = null;
				    $scope.contactPerson = null;
				  },
				  error: function(newSchool, error) {
				    // Execute any logic that should take place if the save fails.
				    // error is a Parse.Error with an error code and message.
				    alert('Failed to create new object, with error code: ' + error.message);
				  }
			});
 			}
 			
 		}

});