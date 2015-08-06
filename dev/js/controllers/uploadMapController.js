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

	$scope.addArea = {
				open: false
			};

	$scope.newMaps = [{'id': 'map1'}];

	$scope.addNewMap = function() {
		var newMapId = $scope.newMaps.length+1
		$scope.newMaps.push({'id': 'map'+newMapId});
	}

	$scope.saveArea = function(areaName, mapName, mapLevel, mapFile){
		var Areas = Parse.Object.extend("Areas");
		var area = new Areas();
		var Maps = Parse.Object.extend("Maps");
		var map = new Maps();
		
			
		map.set("name", mapName);
		map.set("difficulty", parseInt(mapLevel));
		map.save(null, {
			success: function(map) {

				area.set("name", areaName);
				area.set("maps", [map])
				area.save(null, {
				  success: function(area) {
				    // Execute any logic that should take place after the object is saved.
				    //alert('New object created with objectId: ' + area.id);
				    // Collapse addnewarea
				    $scope.addArea = {
				    		open: false
				    	};
				    // Reset form when its saved.
				    $scope.addArea = {
				    	areaName: "",
				    	mapName: "",
				    	levelRadio: 0
				    }
				    console.log('deepinside');

				  },
				  error: function(area, error) {
				    // Execute any logic that should take place if the save fails.
				    // error is a Parse.Error with an error code and message.
				    //alert('Failed to create new object, with error code: ' + error.message);
				    console.log('error area');
				  }
				});

			},
			error: function(map, error) {
				//alert('Failed to create new object, with error code: ' + error.message);
				console.log('error map');
			}
		});
	};
});
