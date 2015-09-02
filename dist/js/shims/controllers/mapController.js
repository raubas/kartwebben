app.controller('mapCtrl', function ($scope, uiGmapGoogleMapApi, geolocation, mapService, markerService, $filter){

	//Initiate google map on Luleå
	uiGmapGoogleMapApi.then(function (maps) {
		$scope.map = mapService.getMap();
		$scope.markerprops = { 	school: { 	url: '/dev/images/icons/skola.png'},
								area: 	{ 	url: '/dev/images/icons/karta.png'}
							};
		
		//Focus on user location if enabled
		geolocation.getLocation().then(function(data){
			//Comment to get user location
			if (data.coords) {
				//mapService.focusOnObjectLocation(data.coords);
			}
    	});
	});

	$scope.areaMarkers = markerService.getAreaMarkerArray();
	$scope.schoolMarkers = markerService.getSchoolMarkerArray();
	$scope.draggableMarker = markerService.getDraggableMarker();
	

	//Listen for map events
	var watchMap = function(){
		$scope.$watch(function () {
        	return mapService.focusOnLocation();
    	}, function (oldValue, newValue) {
        	$scope.map = mapService.focusOnLocation();
    	});
	}

	var watchDraggableMarker = function(){
		$scope.$watch(function () {
        	return markerService.getDraggableMarker();
    	}, function (oldValue, newValue) {
        	$scope.draggableMarker = markerService.getDraggableMarker();
    	});
	}

	$scope.markerClick = function(data){
		mapService.clickOnMarker(data);
	};

	//Init controller
	var init = function () {
		watchMap();
		watchDraggableMarker();
		// check if there is query in url
		// and fire search in case its value is not empty
	};

	//Init function
	init();

	//Remove watchers when view is unloaded
	$scope.$on("$destroy", function(){
        watchMap();
		watchDraggableMarker();
    });

});