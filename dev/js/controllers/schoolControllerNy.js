app.controller('schoolCtrl', function ($scope, uiGmapGoogleMapApi, geolocation, $filter){


	//Initiate google map on Luleå
	uiGmapGoogleMapApi.then(function (maps) {
		$scope.map = { 	center: { latitude: 65.588946, longitude: 22.157324 },
						zoom: 12,
						control: {}
						};
		
		//Focus on user location if enabled
		geolocation.getLocation().then(function(data){
			//Comment to get user location
			//$scope.map = { center: { latitude: data.coords.latitude, longitude: data.coords.longitude }, zoom: 12};
    	});
	});

	//Set varible to scope for a marker on the map
	$scope.clickedLocation = {};

	//Config marker after click on map, updates coords for clickedlocation
	$scope.addMarker = function (obj) {
		//Set marker at clicked location
		$scope.clickedLocation = { 	coords: { 	latitude: obj.latitude,
																						longitude: obj.longitude },
																options: { 	draggable: true,
																						labelContent: 'Dra mig till rätt position!',
							            									labelAnchor: "100 0",
							            									labelClass: "marker-labels",
							            									icon: '/dev/images/icons/fish.png' }
															};
		//Refresh map to see marker
		$scope.map.control.refresh({ 	latitude: obj.latitude,
																	longitude: obj.longitude 
															});
		//Watch for new location
		$scope.$watchCollection("clickedLocation.coords", function (newVal, oldVal) {
		  if (_.isEqual(newVal, oldVal))
		    return;
		});
		$scope.addArea.position = $scope.clickedLocation.coords;
	};

	$scope.addedAreas = [];
	$scope.error = "";

	//Define array of markers
	$scope.areaMarkers = [];
 	$scope.queryForSchools = function() {
 		var query = new Parse.Query("Schools");
		query.include("contactPerson","areas", "areas.maps");
		query.find().then(function(result){
	        angular.forEach(result, function(value, key){
		        	//Nullcheck for position attribute due to fucked up db
		        	if (value.attributes.position != null) {
		        		//Check if marker already exists, if not - add to markers
		        		if ($filter('filter')($scope.areaMarkers, { id: value.id }, true)[0] == null ) {
		        			//Set marker attributes from db
		        			var marker = {
		        				latitude: value.attributes.position._latitude,
		        				longitude: value.attributes.position._longitude,
		        				title: value.attributes.name
		        			};
		        			marker['id'] = value.id;
		        			//Push to array of markers
		        			$scope.areaMarkers.push(marker);
		        		}
		        	};
		        });
	        $scope.schools = result;
	    });
 	}
 		

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
 		//Make queries
	var init = function () {
	   $scope.queryForSchools();
	   // check if there is query in url
	   // and fire search in case its value is not empty
	};

	//Init function
	init();
	
});