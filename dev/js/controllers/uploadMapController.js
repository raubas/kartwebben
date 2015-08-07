app.controller('uploadMapCtrl', function ($scope, uiGmapGoogleMapApi){


	//Config map
	uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = { 	center: { latitude: 65.588946, longitude: 22.157324 },
        				zoom: 12,
        				options: { events: {click: function(mapModel, eventName, originalEventArgs){
														var obj = 	{
																	latitude: originalEventArgs[0].latLng.k,
																	longitude: originalEventArgs[0].latLng.D
																	};
														$scope.addMarker(obj);
													}
											}
								},
						control: {}
					};
    });

	//Set varible to scope for a marker on the map
	$scope.clickedLocation = {};

	//Config marker after click on map, updates coords for clickedlocation
	$scope.addMarker = function (obj) {
		//Set marker at clicked location
		$scope.clickedLocation = { 	coords: { 	latitude: obj.latitude,
												longitude: obj.longitude },
									options: { draggable: true }
								};
		//Refresh map to see marker
		$scope.map.control.refresh({ 	latitude: obj.latitude,
										longitude: obj.longitude 
										});
		//Watch for new location
		$scope.$watchCollection("clickedLocation.coords", function (newVal, oldVal) {
		  if (_.isEqual(newVal, oldVal))
		    return;
		  console.log(newVal);
		  console.log($scope.clickedLocation.coords);
		});
	};

	//Define array of markers
	$scope.areaMarkers = [];

	//Query for areas with maps
	var query = new Parse.Query("Areas");
		query.include("maps");
		query.find().then(function(result){
	        angular.forEach(result, function(value, key){
	        	//Nullcheck for position attribute due to fucked up db
	        	if (value.attributes.position != null) {
	        		//Set marker attributes from db
	        		var marker = {
	        			latitude: value.attributes.position._latitude,
	        			longitude: value.attributes.position._longitude,
	        			title: value.attributes.name
	        		};
	        		marker['id'] = value.id;
	        		//Push to array of markers
	        		$scope.areaMarkers.push(marker);
	        	};
	        });
	        $scope.areas = result;
	    });

	$scope.displayMap = function($url){
		return $url;
	}

	// var queryMaps = new Parse.Query("Maps");
	// 	queryMaps.find().then(function(result){
	// 	$scope.maps = result;
	// });

	$scope.newAreaPanel = {
				open: false
			};

	$scope.newMaps = [{'id': 'map1'}];
	$scope.arrayMaps = [];

	$scope.addNewMap = function() {
		var newMapId = $scope.newMaps.length+1;
		$scope.newMaps.push({'id': 'map'+newMapId});
	}

	$scope.uploadFile = function(files) {
		var Map = Parse.Object.extend("Maps");
		var mapfile = new Parse.File("map.png", files[0]);
		
		mapfile.save().then(function(){
			console.log("file saved");
		}, function(error){
			console.log(error);
		});
		var currentIndex = $scope.newMaps.length-1;
		var map = new Map();
		map.set("name", $scope.newMaps[currentIndex].mapName);
		map.set("difficulty", parseInt($scope.newMaps[currentIndex].mapLevel));
		map.set("file", mapfile);
		map.save(null, {
			success: function(map) {
				console.log('sparad karta');
				$scope.arrayMaps.push(map);
			},
			error: function(map, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error map');
			}
		});
	};

	$scope.saveArea = function(areaName){
		var Area = Parse.Object.extend("Areas");
		var area = new Area();
		area.set("name", areaName);
		area.set("maps", $scope.arrayMaps);
		area.save(null, {
			success: function(area) {
				console.log('sparad area');
				// Close panel 
				  $scope.newAreaPanel = {
			    		open: false
			    	};
			    // Reset form when its saved.
			},
			error: function(area, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error area');
			}
		});
	};
});
