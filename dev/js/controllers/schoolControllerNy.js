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
	$scope.addSchool = {};
	$scope.contactPerson = {};
	$scope.showEdit = false;
	// $scope.error = "";

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
		$scope.addSchool.position = $scope.clickedLocation.coords;
	};

	$scope.addPositionToSchool = function () {
		var obj = $scope.map.center;
		$scope.addMarker(obj);
	}

	$scope.markerClick = function(data){
		var obj = { id: data.key };
		obj[data.key] = true;
		$scope.clickedMarker = obj;
		console.log('marker click');
		//Scroll to area
		scrollTo.classId('rightbar', data.key);

	};

	//Define array of markers
	$scope.schoolMarkers = [];

 	$scope.queryForSchools = function() {
 		var query = new Parse.Query("Schools");
		query.include("contactPerson","areas", "areas.maps");
		query.find().then(function(result){
	        angular.forEach(result, function(value, key){
		        	//Nullcheck for position attribute due to fucked up db
		        	if (value.attributes.position != null) {
		        		//Check if marker already exists, if not - add to markers
		        		if ($filter('filter')($scope.schoolMarkers, { id: value.id }, true)[0] == null ) {
		        			//Set marker attributes from db
		        			var marker = {
		        				latitude: value.attributes.position._latitude,
		        				longitude: value.attributes.position._longitude,
		        				title: value.attributes.name
		        			};
		        			marker['id'] = value.id;
		        			//Push to array of markers
		        			$scope.schoolMarkers.push(marker);
		        		}
		        	};
		        });
	        $scope.schools = result;
	    });
 	}
 		
 	//Return url-string from parse-url
	$scope.displayMap = function($url){
		return $url;
	}

	//Function to place draggable marker for changing of school location
	$scope.changeLocationOfSchool = function (school){
		//Find current marker, delete from school markers and add draggable marker to map
		var markerOfSchool = $filter('filter')($scope.schoolMarkers, { id: school.id }, true)[0];
		$scope.schoolMarkers.splice($scope.schoolMarkers.indexOf(markerOfSchool), 1);
		$scope.addMarker(school.attributes.position);
	}

	// Set var to collapse add new school.
	$scope.newSchoolPanel = {
				open: false
			};

	$scope.saveNewSchool = function(school, contactPerson, newSchoolForm){
		var School = Parse.Object.extend("Schools");
		var ContactPerson = Parse.Object.extend("ContactPerson");

		var newContactPerson = new ContactPerson();
		newContactPerson.set("name", $scope.contactPerson.name);
		newContactPerson.set("phoneNumber", $scope.contactPerson.phoneNumber);
		newContactPerson.set("email", $scope.contactPerson.email);

		var school = new School();
		var position = new Parse.GeoPoint($scope.addSchool.position);
		school.set("name", $scope.addSchool.schoolName);
		school.set("position", position);
		school.set("contactPerson", newContactPerson);
		school.save(null, {
			success: function(school) {
				console.log('sparad school');
				// Close panel 
				  $scope.newSchoolPanel = {
			    		open: false
			    	};
			    $scope.clickedLocation = {};
			    if ($scope.queryForSchools()){
			    	scrollTo.classId('rightbar', school.id);
			    };
			    // Reset form when its saved.
			},
			error: function(school, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error school');
			}
		});
	};

	// Updates area postion, called from interface button.
	$scope.updateSchool = function(school){
		var position = new Parse.GeoPoint($scope.clickedLocation.coords);
		console.log(position);
		if (position.latitude == 0) {

		} else {
			school.set("position", position);
		}
		school.attributes.contactPerson.set("name", school.attributes.contactPerson.attributes.name);
		school.attributes.contactPerson.set("phoneNumber", school.attributes.contactPerson.attributes.phoneNumber);
		school.attributes.contactPerson.set("email", school.attributes.contactPerson.attributes.email);
		school.save(school, {
			success: function(school) {
				console.log('Uppdaterat skolan!');
				$scope.queryForSchools();
				$scope.clickedLocation = {};

			},
			error: function(school, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error school');
			}
		});
	}

	//Ta bort skola + associerade kontaktperson,
	$scope.deleteSchool = function(school){
		Parse.Object.destroyAll([school.attributes.contactPerson], {
			success: function(){
				school.destroy({
					  success: function(myObject) {
					    // The object was deleted from the Parse Cloud.
					    console.log('school och contactPerson deleted');
					    $scope.queryForSchools();
					  },
					  error: function(myObject, error) {
					    // The delete failed.
					    // error is a Parse.Error with an error code and message.
					    console.log('fel');
					  }
					})
			},
			error: function(error) {
      	console.error("Error deleting related comments " + error.code + ": " + error.message);
      }
		});
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