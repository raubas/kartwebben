app.controller('mapCtrl', function ($scope, uiGmapGoogleMapApi, geolocation, mapService, markerService, $filter, mobileHider){

	//Initiate google map on Luleå
	uiGmapGoogleMapApi.then(function (maps) {
		$scope.map = mapService.getMap();
		$scope.markerprops = { 	school: { 	url: '/images/icons/skola.png'},
								area: 	{ 	url: '/images/icons/karta.png'}
							};

		//Focus on user location if enabled
		// geolocation.getLocation().then(function(data){
		// 	//Comment to get user location
		// 	if (data.coords) {
		// 		//mapService.focusOnObjectLocation(data.coords);
		// 	}
    // 	});
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

	$scope.hideMap = function() {
		mobileHider.setMapVisibility(false);
		mobileHider.setRightbarVisibility(true);

	}

	var watchVisibility = function(){
		$scope.$watch(function () {
        	return mobileHider.getMapVisibility();
    	}, function (oldValue, newValue) {
        	$scope.showMap = mobileHider.getMapVisibility();
    	});
	}

	//Init controller
	var init = function () {
		watchMap();
		watchDraggableMarker();
		watchVisibility();

		// check if there is query in url
		// and fire search in case its value is not empty
	};

	//Init function
	init();

	//Remove watchers when view is unloaded
	$scope.$on("$destroy", function(){
        watchMap();
        watchVisibility();
				watchDraggableMarker();
    });



});
