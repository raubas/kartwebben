app.controller('uploadMapCtrl', function($scope, uiGmapGoogleMapApi){

	uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = { center: { latitude: 65.588946, longitude: 22.157324 }, zoom: 11 };
        console.log('laddad');
    });

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
