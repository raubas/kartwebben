app.controller('uploadMapCtrl', function ($scope, $filter, uiGmapGoogleMapApi, scrollTo, $timeout){

	//Config map
	uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = { 	center: { latitude: 65.588946, longitude: 22.157324 },
        				zoom: 12,
        // 				options: { 	events: {click: function(mapModel, eventName, originalEventArgs){
								// 															var obj = 	{
								// 																		latitude: originalEventArgs[0].latLng.k,
								// 																		longitude: originalEventArgs[0].latLng.D
								// 																		};
								// 															$scope.addMarker(obj);
								// 														}
								// 										},
														
								// },
						control: {}
					};
    });

	//Set varible to scope for a marker on the map
	$scope.clickedLocation = {};
	$scope.addArea = {};

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

	$scope.addPositionToArea = function () {
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
	$scope.areaMarkers = [];

	$scope.queryForAreas = function () {
		//Query for areas with maps
		var query = new Parse.Query("Areas");
		query.include("maps");
		query.find().then(function(result){
			//Save results to scope
			$scope.areas = result;
			console.log('areas updated');
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
		});

	}

	//Return url-string from parse-url
	$scope.displayMap = function($url){
		return $url;
	}

	//Function to place draggable marker for changing of areas location
	$scope.changeLocationOfArea = function (area){
		//Find current marker, delete from area markers and add draggable marker to map
		var markerOfArea = $filter('filter')($scope.areaMarkers, { id: area.id }, true)[0];
		$scope.areaMarkers.splice($scope.areaMarkers.indexOf(markerOfArea), 1);
		$scope.addMarker(area.attributes.position);
	}


	// Set var to collapse add new area.
	$scope.newAreaPanel = {
				open: false
			};

	// adds a new map object to newMaps array.
	$scope.addNewMap = function() {
		var newMapId = $scope.newMaps.length+1;
		$scope.newMaps.push({'id': 'map'+newMapId});
	}

	// Saves the new map when the file is uploaded
	$scope.uploadFile = function(files) {
		var Map = Parse.Object.extend("Maps");
		var mapfile = new Parse.File("map.png", files[0]);
		
		mapfile.save().then(function(){
			console.log("file saved");
			$scope.uploadedMap = mapfile;
		}, function(error){
			console.log(error);
		});
	};

	// Save uploaded map
	$scope.saveMap = function(area) {
		var map = new Map();
		map.set("name", newMap.mapName);
		map.set("difficulty", parseInt(newMap.mapLevel));
		map.set("file", $scope.uploadedMap);
		map.save(null, {
			success: function(map) {
				console.log('sparad karta');
				area.attributes.maps.push(map);
			},
			error: function(map, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error map');
			}
		});
	}

	// Saves the area with pointers to all the maps included.
	$scope.saveArea = function(){
		var Area = Parse.Object.extend("Areas");
		var area = new Area();
		var position = new Parse.GeoPoint($scope.addArea.position);
		area.set("name", $scope.addArea.areaName);
		area.set("position", position);
		area.save(null, {
			success: function(area) {
				console.log('sparad area');
				// Close panel 
				  $scope.newAreaPanel = {
			    		open: false
			    	};
			    $scope.clickedLocation = {};
			    $scope.queryForAreas();
			    //Set data object for markerClick-function
			    var dataObj = {key: area.id};
			    //Internal function to call markerclick after query + DOM-update
			    var runClickFunc = function (data){
			    	if(data){
			    		//Timeout to wait for DOM-update
			    		$timeout(function(){
			    			$scope.markerClick(dataObj);
			    			//Unregister scope.on-event
			    			listenForRender();
			    		}, 1000);
			    	}
			    };
			    //Register listener for when all elements are added to rightbar
			    var listenForRender = $scope.$on('newRendered', function(event, data) { runClickFunc(data); });
			    
			    // Reset form when its saved.
			},
			error: function(area, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error area');
			}
		});
	};

	$scope.deleteMap = function(area, map){
		console.log(area.attributes.maps)
		area.attributes.maps.splice(area.attributes.maps.indexOf(map), 1);
		map.destroy({
			success: function(map) {
				console.log(area.attributes.maps);
				area.set("maps", area.attributes.maps);
				area.save(area, {
					success: function(area) {
						console.log('Map deleted!');
						$scope.queryForAreas();
					},
					error: function(area, error) {
						//alert('Failed to create new object, with error code: ' + error.message);
						console.log('error area');
					}
				});
			},
			error: function(map, error){

			}
		});
	}

	//Ta bort area + associerade kartor, fungerer icke!
	$scope.deleteArea = function(area){
		Parse.Object.destroyAll(area.attributes.maps, {
			success: function(){
				area.destroy({
					  success: function(myObject) {
					    // The object was deleted from the Parse Cloud.
					    console.log('allt borta');
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

	$scope.saveChangesToArea = function(area){
		var position = new Parse.GeoPoint($scope.clickedLocation.coords);
		area.set("position", position);
		area.save(area, {
			success: function(area) {
				console.log('Uppdaterat!');
				$scope.queryForAreas();
				$scope.clickedLocation = {};
			},
			error: function(area, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error area');
			}
		});
	}

	//Make queries
	var init = function () {
	   $scope.queryForAreas();
	   // check if there is query in url
	   // and fire search in case its value is not empty
	};

	//Init function
	init();

});
