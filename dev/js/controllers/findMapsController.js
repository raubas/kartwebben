app.controller('findMapsCtrl', function ($scope, uiGmapGoogleMapApi, geolocation, $modal){

	//Initiate google map on Luleå
	uiGmapGoogleMapApi.then(function (maps) {
		$scope.map = { 	center: { latitude: 65.588946, longitude: 22.157324 },
						zoom: 12
						};
		
		//Focus on user location if enabled
		geolocation.getLocation().then(function(data){
			//Comment to get user location
			//$scope.map = { center: { latitude: data.coords.latitude, longitude: data.coords.longitude }, zoom: 12};
    	});
	});

	$scope.areaMarkers = [];
	//Get areas from db
	var query = new Parse.Query("Areas");
	query.include("maps");
	query.find().then(function(result){
		angular.forEach(result, function(value, key){
			//Nullcheck for position attribute due to fucked up db
			if (value.attributes.position != null) {
				var marker = {
					latitude: value.attributes.position._latitude,
					longitude: value.attributes.position._longitude,
					title: value.attributes.name
				};
				marker['id'] = value.id;
				$scope.areaMarkers.push(marker);
			};
		});

		//Save areas to scope
		$scope.areas = result;
	});

	//Get schools from db
	var query = new Parse.Query("Schools");
	query.find().then(function (result){
		$scope.schools = result;
	});

	//Tvek om detta funkar
	$scope.scrollTo = function(container, anchor) {
		    console.log(container);
		    console.log(anchor);
		    var element = angular.element(anchor);
		    angular.element(container).animate({scrollTop: element.offset().top}, "slow");
		    
		}

	$scope.markerClick = function(data){
		var obj = { id: data.key };
		obj[data.key] = true;
		$scope.clickedMarker = obj;

		//Tveksam till denna
		//$scope.scrollTo('rightbar', data.key);

	};

	$scope.displayMap = function($url){
		return $url;
	}

	$scope.focusOnSchool = function(school){
		$scope.map = { 	center: { 	latitude: school.attributes.position._latitude,
									longitude: school.attributes.position._longitude },
						zoom: 12 };
		$scope.choosenSchool = { 	coords: { 	latitude: school.attributes.position._latitude,
												longitude: school.attributes.position._longitude },
									key: school.id,
									options: {	labelContent: school.attributes.name,
            									labelAnchor: "100 0",
            									labelClass: "marker-labels",
            									icon: '/dev/images/icons/fish.png'
											}
								};
		console.log(school.id);
	}

	//Open modal for preview
	$scope.name = 'theNameHasBeenPassed';
	
	$scope.showModal = function(url) {
	  
	  $scope.opts = {
	  backdrop: true,
	  backdropClick: true,
	  dialogFade: false,
	  keyboard: true,
	  templateUrl : 'mapPreviewModal.html',
	  controller : ModalInstanceCtrl,
	  resolve: {} // empty storage
	    };
	    
	  
	  $scope.opts.resolve.item = function() {
	      return angular.copy({	previewUrl: url,
	      						pdfUrl: '/dev/images/icons/fish.png'}); // pass name to Dialog
	  }
	  
	    var modalInstance = $modal.open($scope.opts);
	    
	    modalInstance.result.then(function(){
	      //on ok button press 
	    },function(){
	      //on cancel button press
	      console.log("Modal Closed");
	    });
	}; 

	// $scope.difficulties = { 'one' : {name:'Åk 1', number:'1'},
	// 						'two' : {name:'Åk 2', number:'2'},
	// 						'three' : {name:'Åk 3', number:'3'}};
	
	// $scope.setSchool = function ($school) {
	// 	$scope.activeSchool = $school;
	// }

	// $scope.findAreas = function ($difficulty){
	// 	$scope.activeDifficulty = $difficulty;
	// 	// var Area = Parse.Object.extend("Areas");
	// 	// var query = new Parse.Query(Area);
	// 	// query.containedIn("schools", ["57ibFeJ5PN"]);
	// 	// query.include("Maps");
	// 	// query.find().then(function(result){
	// 	// 	$scope.areas = result;
	// 	// 	$scope.findMaps(result);
	// 	// 	console.log(result);
	// 	// });

	// 	//var School = Parse.Object.extend("ContactPerson");
	// 	var schoolQuery = new Parse.Query("Schools");
	// 	schoolQuery.equalTo("name", $scope.activeSchool.attributes.name);
	// 	schoolQuery.include("areas", "areas.maps");
	// 	schoolQuery.first().then(function(result){
	// 		$scope.choosenSchool = result;
	// 		console.log(result);
	// 	});
	// }

	// $scope.findMaps = function($areas){
	// 	//console.log($areas);
	// 	$scope.mapsForSearch = [];
	// 	angular.forEach($areas, function(value, key){
	// 		angular.forEach(value.attributes.maps, function(value, key){
	// 			$scope.mapsForSearch.push(value);
	// 		})
	// 	});
	// 	var query = new Parse.Query("Maps");
	// 	query.containedIn("objectId", $scope.mapsForSearch);
	// 	query.find().then(function(result){
	// 		$scope.maps = result;
	// 		$scope.displayMaps();
	// 	});
	// }

	// $scope.displayMap = function($url){
	// 	return $url;
	// }

});