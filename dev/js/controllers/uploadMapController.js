app.controller('uploadMapCtrl', function($scope){

	var query = new Parse.Query("Areas");
		query.include("maps");
		query.find().then(function(result){
	        $scope.areas = result;
	    });

	$scope.displayMap = function($url){
		return $url;
	}

	var queryMaps = new Parse.Query("Maps");
		queryMaps.find().then(function(result){
		$scope.maps = result;
	});


	$scope.saveArea = function(name, level, file){
		var Areas = Parse.Object.extend("Areas");
		var area = new Areas();
		area.set("name",name);
		area.save(null, {
		  success: function(area) {
		    // Execute any logic that should take place after the object is saved.
		    alert('New object created with objectId: ' + area.id);
		  },
		  error: function(area, error) {
		    // Execute any logic that should take place if the save fails.
		    // error is a Parse.Error with an error code and message.
		    alert('Failed to create new object, with error code: ' + error.message);
		  }
		});
	};



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
