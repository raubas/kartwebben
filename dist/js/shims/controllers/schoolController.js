

app.controller('schoolCtrlold',

	

 	function addSchoolCtrl($scope){
 		$scope.addedAreas = [];
 		$scope.error = "";
 		var query = new Parse.Query("Schools");
		query.include("contactPerson","areas", "areas.maps");
		query.find().then(function(result){
	        $scope.schools = result;
	    });

 		$scope.saveSchool = function(school, contactPerson, newSchoolForm){
 			console.log(newSchoolForm.$valid);
 			if (newSchoolForm.$valid) {
 				var Schools = Parse.Object.extend("Schools");
 				var ContactPerson = Parse.Object.extend("ContactPerson");

 				var newContactPerson = new ContactPerson();
 				newContactPerson.set("name", contactPerson.name);
 				newContactPerson.set("phoneNumber", contactPerson.phoneNumber);
 				newContactPerson.set("email", contactPerson.email);

				var newSchool = new Schools();
				newSchool.set("name", school.name);
				newSchool.set("contactPerson", newContactPerson);
				newSchool.save(null, {
				  success: function(newSchool) {
				    // Execute any logic that should take place after the object is saved.

				    alert('New object created with objectId: ' + newSchool.id);
				    $scope.school = null;
				    $scope.contactPerson = null;
			    	query.find().then(function(result){
			            $scope.schools = result;
			        });

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