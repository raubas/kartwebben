app.controller('skolorCtrl', function ($scope,$modal, uiGmapGoogleMapApi, mapService, markerService, scrollTo, $filter, $timeout){

	//Config marker after click on map, updates coords for clickedlocation
	$scope.addMarker = function (obj) {
		//Set marker at clicked location
		var object = { 	latitude: obj._latitude,
						longitude: obj._longitude };
		markerService.addDraggableMarker(object);
		mapService.focusOnObjectLocation(object);

		//Watch for new location
		$scope.$watchCollection("draggableMarker.coords", function (newVal, oldVal) {
		  if (_.isEqual(newVal, oldVal))
		    console.log('lika');
		    return;
		});
	};

	$scope.addPositionToSchool = function () {
		var map = mapService.getMap();
		var obj = { latitude: map.center.latitude,
					longitude: map.center.longitude };
		markerService.addDraggableMarker(obj);
	}

	//Listen for map click-events
	var watchClick = function(){
		$scope.$watch(function () {
        	return mapService.listenForClick();
    	}, function (oldValue, newValue) {
			var object = mapService.listenForClick();
			console.log(object);
			if (object.key != null) {
				var obj = { id: object.key };
				obj[object.key] = true;
				//Set open accordion
				$scope.openAccordion = obj;
				console.log($scope.openAccordion);
				//Scroll to area
				scrollTo.classId('rightbar', object.key);
			};
    	});
	}

	//Listen for when draggable marker moves
	var watchDraggableMarker = function(){
		$scope.$watch(function () {
			console.log("HEHEHE");
        	return markerService.getDraggableMarker();
    	}, function (oldValue, newValue) {
        	$scope.draggableMarker = markerService.getDraggableMarker();
        	$scope.addSchool.position = $scope.draggableMarker.coords;
        	console.log('marker moved');
    	});
	}

	var scrollToSchool = function(school){
		//Set data object for markerClick-function
		var dataObj = {key: school.id};
		//Internal function to call markerclick after query + DOM-update
		var runClickFunc = function (data){
			if(data){
				//Timeout to wait for DOM-update
				$timeout(function(){
					mapService.clickOnMarker(dataObj);
					//Unregister scope.on-event
					listenForRender();
				}, 100);
			}
		};
		//Register listener for when all elements are added to rightbar
		var listenForRender = $scope.$on('newRendered', function(event, data) { runClickFunc(data); });
	}

 	$scope.queryForSchools = function() {
 		var query = new Parse.Query("Schools");
 		query.ascending("name");
		query.include("contactPerson","areas", "areas.maps");
		query.find().then(function(result){
			$scope.schools = result;
	        angular.forEach(result, function(value, key){
				//Nullcheck for position attribute due to fucked up db
				if (value.attributes.position != null) {
					//Push to map using service
					markerService.addToSchoolMarkerArray(value);
				};
		    });
	    });
 	}
 		

	//Function to place draggable marker for changing of school location
	$scope.changeLocationOfSchool = function (school){
		//Find current marker, delete from school markers and add draggable marker to map
		markerService.removeFromSchoolMarkerArray(school);
		$scope.addMarker(school.attributes.position);
	}

	

	$scope.saveNewSchool = function(school, contactPerson, newSchoolForm){
		var School = Parse.Object.extend("Schools");
		var ContactPerson = Parse.Object.extend("ContactPerson");

		var newContactPerson = new ContactPerson();
		newContactPerson.set("name", $scope.contactPerson.name);
		newContactPerson.set("phoneNumber", $scope.contactPerson.phoneNumber);
		newContactPerson.set("email", $scope.contactPerson.email);

		var school = new School();
		var position = new Parse.GeoPoint($scope.draggableMarker.coords);
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
			    
			    markerService.removeDraggableMarker();
		    	markerService.addToSchoolMarkerArray(school);

			    $scope.addSchool.schoolName = "";
			    $scope.contactPerson.name = "";
			    $scope.contactPerson.phoneNumber = "";
			    $scope.contactPerson.email = "";
			    
			    $scope.schools.push(school);
			    
			    scrollToSchool(school);
			},
			error: function(school, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error school');
			}
		});
	};

	// Updates school postion, called from interface button.
	$scope.updateSchool = function(school){
		var position = new Parse.GeoPoint($scope.draggableMarker.coords);
		console.log(position);
		
		if (position.latitude == 0) {

		} else {
			school.set("position", position);
		}
		console.log(school.attributes.name);
		school.set("name", school.attributes.name);
		school.attributes.contactPerson.set("name", school.attributes.contactPerson.attributes.name);
		school.attributes.contactPerson.set("phoneNumber", school.attributes.contactPerson.attributes.phoneNumber);
		school.attributes.contactPerson.set("email", school.attributes.contactPerson.attributes.email);
		school.save(school, {
			success: function(school) {
				console.log('Uppdaterat skolan!');
				markerService.removeDraggableMarker();
		    	markerService.addToSchoolMarkerArray(school);
				
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
					  success: function(school) {
					    // The object was deleted from the Parse Cloud.
					    console.log('school och contactPerson deleted');
					    markerService.removeFromSchoolMarkerArray(school);
					    var schoolToDelete = $filter('filter')($scope.schools, { id: school.id }, true)[0];
					    $scope.schools.splice($scope.schools.indexOf(schoolToDelete), 1);
					  },
					  error: function(school, error) {
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

	$scope.showModal = function(school) {
	  
	  $scope.opts = {
		  backdrop: true,
		  backdropClick: true,
		  dialogFade: false,
		  keyboard: true,
		  templateUrl : 'components/deleteModal.html',
		  controller : ModalInstanceCtrl,
		  resolve: {} // empty storage
	    };
	    
	  
	  $scope.opts.resolve.item = function() {
	      return angular.copy({	school: school}); // pass name to Dialog
	  }
	  
	    var modalInstance = $modal.open($scope.opts);
	    
	    modalInstance.result.then(function(scope){
	      //on ok button press

	      $scope.deleteSchool(scope.item.school);
	    },function(){
	      //on cancel button press
	    });
	}; 

 		//Make queries
	var init = function () {
	   $scope.queryForSchools();
	   // Set var to collapse add new school.
		$scope.newSchoolPanel = { open: false };
		//Set which accordion is open
		$scope.openAccordion = {};
		//Set varible to scope for a marker on the map
		$scope.addSchool = {};
		$scope.contactPerson = {};
		$scope.showEdit = false;
		// $scope.error = "";

	   	//Watch variables from map
	   	watchClick();
		watchDraggableMarker();
	};

	//Init function
	init();
	
});