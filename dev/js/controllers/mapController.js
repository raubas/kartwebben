app.controller('mapCtrl', function ($scope, uiGmapGoogleMapApi, geolocation, mapService, markerService, $filter){

	//Initiate google map on Luleå
	uiGmapGoogleMapApi.then(function (maps) {
		$scope.map = mapService.getMap();
		
		//Focus on user location if enabled
		geolocation.getLocation().then(function(data){
			//Comment to get user location
			//$scope.map = { center: { latitude: data.coords.latitude, longitude: data.coords.longitude }, zoom: 12};
    	});
	});

	$scope.markerprops = { 	school: { url: '/dev/images/icons/fish.png'},
							area: 	{ url: '/dev/images/icons/pin.png'}};

	$scope.areaMarkers = markerService.getAreaMarkerArray();
	$scope.schoolMarkers = markerService.getSchoolMarkerArray();

	var watchMap = function(){
		$scope.$watch(function () {
        	return mapService.focusOnLocation();
    	}, function (oldValue, newValue) {
        	$scope.map = mapService.focusOnLocation();
    	});
	}

	$scope.markerClick = function(data){
		var obj = { id: data.key };
		obj[data.key] = true;
		$scope.clickedMarker = obj;
		console.log(data);
		//Scroll to area
		//scrollTo.classId('rightbar', data.key);

	};

});