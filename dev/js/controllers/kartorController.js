app.controller('uploadMapCtrl', function ($scope, $filter, $q, $modal, uiGmapGoogleMapApi, mapService, markerService, scrollTo, $timeout, $http, Upload, PDFToPNG, usSpinnerService, mobileHider){




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

	//Place draggable marker on map
	$scope.addPositionToArea = function () {
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
			if (object.key != null) {
				var obj = { id: object.key };
				obj[object.key] = true;
				//Set open accordion
				$scope.openAccordion = obj;
				//Scroll to area
				scrollTo.classId('rightbar', object.key);
			};
    	});
	}

	//Listen for when draggable marker moves
	var watchDraggableMarker = function(){
		$scope.$watch(function () {
        	return markerService.getDraggableMarker();
    	}, function (oldValue, newValue) {
        	$scope.draggableMarker = markerService.getDraggableMarker();
        	$scope.addArea.position = $scope.draggableMarker.coords;
        	console.log('marker moved');
    	});
	}

	var scrollToArea = function(area){
		//Set data object for markerClick-function
		var dataObj = {key: area.id};
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


	$scope.queryForAreas = function () {
		//Query for areas with maps
		var query = new Parse.Query("Areas");
		query.include("maps");
		query.ascending("name");
		query.find().then(function(result){
			//Save results to scope
			$scope.areas = result;
			console.log('areas updated');
			angular.forEach(result, function(value, key){
				//Nullcheck for position attribute due to fucked up db
				if (value.attributes.position != null) {
					//Push to map using service
					markerService.addToAreaMarkerArray(value);
				};
			});
		});
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

	//Return url-string from parse-url
	$scope.displayMap = function($url){
		return $url;
	}

	//Function to place draggable marker for changing of areas location
	$scope.changeLocationOfArea = function (area){
		//Find current marker, delete from area markers and add draggable marker to map
		markerService.removeFromAreaMarkerArray(area);
		$scope.addMarker(area.attributes.position);
	}

	// Saves the new area without any maps.
	$scope.saveNewArea = function(){
		var Area = Parse.Object.extend("Areas");
		var area = new Area();
		var position = new Parse.GeoPoint($scope.draggableMarker.coords);
		area.set("name", $scope.addArea.areaName);
		area.set("position", position);
		area.set("maps", []);
		area.save(null, {
			success: function(area) {
				console.log('sparad area');
				// Close panel 
			  	$scope.newAreaPanel = {
		    		open: false
		    	};

		    	markerService.removeDraggableMarker();
		    	markerService.addToAreaMarkerArray(area);

			    $scope.areas.push(area);
			    $scope.addArea.areaName = "";
			    
			    scrollToArea(area);
			},
			error: function(area, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error area');
			}
		});
	};

	// FILE UPLOAD //

	// Saves the new mapfile when the file is uploaded
	$scope.uploadFile = function(files) {
		var mapfile = new Parse.File("map.pdf", files[0]);
		

		mapfile.save().then(function(){
			console.log("file saved");
			$scope.newMap.uploadedMap = mapfile;
			
			$scope.$digest();
		}, function(error){
			console.log(error);
		});
	};

    $scope.onFileSelect = function($file) {  
        if ($file != null) {
        	usSpinnerService.spin('spinner-1');
    		var mapfile = new Parse.File("map.pdf",$file);
    		var pdf = PDFToPNG.makePNG($file).then(function(result) {
    			var mapPreview = new Parse.File("map.png",{base64 : result});
    			mapPreview.save().then(function(){
    				$scope.newMap.uploadedMapPreview = mapPreview;
    			}, function(error){
    				console.log(error);
    			})
    		});
    		var png = mapfile.save().then(function(){
    			$scope.newMap.uploadedMap = mapfile;
    			
    			
    		}, function(error){
    			console.log(error);
    		});
    		$q.all([pdf, png]).then(function(){
    			$scope.dropBoxClass = "drop-box-ok"
    			$scope.uploaded = true;
				usSpinnerService.stop('spinner-1');
    		})
        }
    };

    



    $scope.log = '';
	// Saves the new mapfile when the file is uploaded
	// $scope.uploadFile = function(files) {
	
	// };

	// Save uploaded map to area, and call updateAreaMaps
	$scope.saveMap = function(area) {
		var Map = Parse.Object.extend("Maps");
		var map = new Map();
		map.set("name", $scope.newMap.mapName);
		map.set("difficulty", parseInt($scope.newMap.mapLevel));
		map.set("file", $scope.newMap.uploadedMap);
		map.set("mapPreview", $scope.newMap.uploadedMapPreview);
		map.save(null, {
			success: function(map) {
				console.log('sparad karta');
				area.attributes.maps.push(map);
				$scope.updateAreaMaps(area, map);
				$scope.newMap.uploadedMap = null;
				$scope.newMap.mapName = "";
				$scope.newMap.mapLevel = "";
				$scope.newMap.mapLevel = "";
				$scope.dropBoxClass = "drop-box"
				$scope.uploaded = false;

			},
			error: function(map, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error map');
			}
		});
	}

	// Update area maps new and deleted, called from saveMap and from deleteMap
	$scope.updateAreaMaps = function(area){
		area.set("maps", area.attributes.maps);
		// Kankse inte ska vara null här utan area? men det verkar updatera rätt så kanske inte...
		area.save(null, {
			success: function(area) {
				console.log('sparad karta');
			},
			error: function(area, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error karta');
			}
		});
	} 

	// Updates area postion, called from interface button.
	$scope.updateAreaPosition = function(area){
		var position = new Parse.GeoPoint($scope.draggableMarker.coords);
		area.set("position", position);
		area.save(area, {
			success: function(area) {
				console.log('Uppdaterat!');
				markerService.removeDraggableMarker();
				markerService.addToAreaMarkerArray(area);
			},
			error: function(area, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error area');
			}
		});
	}
	
	// Delets a map inside a area.
	$scope.deleteMap = function(area, map){
		area.attributes.maps.splice(area.attributes.maps.indexOf(map), 1);
		map.destroy({
			success: function(map) {
				$scope.updateAreaMaps(area);
			},
			error: function(map, error){

			}
		});
	}

	//Ta bort area + associerade kartor,
	$scope.deleteArea = function(area){
		Parse.Object.destroyAll(area.attributes.maps, {
			success: function(){
				area.destroy({
					  success: function(area) {
					    // The object was deleted from the Parse Cloud.
					    console.log('area och kartor deleted');
					    // $scope.queryForAreas();
					    markerService.removeFromAreaMarkerArray(area);
					    var areaToDelete = $filter('filter')($scope.areas, { id: area.id }, true)[0];
					    $scope.areas.splice($scope.areas.indexOf(areaToDelete), 1);

					  },
					  error: function(area, error) {
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

	$scope.showModal = function(area) {
	  
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
	      return angular.copy({	area: area}); // pass name to Dialog
	  }
	  
	    var modalInstance = $modal.open($scope.opts);
	    
	    modalInstance.result.then(function(scope){
	      //on ok button press

	      $scope.deleteArea(scope.item.area);
	    },function(){
	      //on cancel button press
	    });
	}; 

	// Show and hide rightbar on moblie
	$scope.hideRightbar = function() {
		mobileHider.setRightbarVisibility(false);
		mobileHider.setMapVisibility(true);
	}

	var watchVisibility = function(){
		$scope.$watch(function () {
        	return mobileHider.getRightbarVisibility();
    	}, function (oldValue, newValue) {
        	$scope.showRightbar = mobileHider.getRightbarVisibility();
    	});
	}


	//Init controller
	var init = function () {

		$scope.dropBoxClass = "drop-box";
		$scope.uploaded = false;
		//Add area form object
		$scope.addArea = {};
		//New map upload
		$scope.newMap = {};
		// Set var to collapse add new area.
		$scope.newAreaPanel = { open: false };
		//Set which accordion is open
		$scope.openAccordion = {};
		//Query for areas
	   	$scope.queryForAreas();
	   	$scope.queryForSchools();

	   	//Watch variables from map
	   	watchClick();
	   	watchVisibility();
		watchDraggableMarker();
	};

	//Init function
	init();

	//Remove watchers when view is unloaded
	$scope.$on("$destroy", function(){
        watchClick();
        watchVisibility();
        watchDraggableMarker();
        //markerService.removeDraggableMarker();
    });


});
