app.controller('findMapsCtrl', function ($scope, $modal, $filter, mapService, markerService, scrollTo){

	
	//Get areas from db
	var query = new Parse.Query("Areas");
	query.include("maps");
	query.find().then(function(result){
		angular.forEach(result, function(value, key){
			//Nullcheck for position attribute due to fucked up db
			if (value.attributes.position != null) {
				//Push to map using service
				markerService.addToAreaMarkerArray(value);
			};
		});
		//Save areas to scope
		$scope.areas = result;
	});
	
	//Get schools from db
	var query = new Parse.Query("Schools");
	query.find().then(function (result){
		angular.forEach(result, function(value, key){
			//Nullcheck for position attribute due to fucked up db
			if (value.attributes.position != null) {
				//Push to map using service
				markerService.addToSchoolMarkerArray(value);
			};
		});
		$scope.schools = result;
	});

	
	//Listen for map events
	var watchClick = function(){
		$scope.$watch(function () {
        	return mapService.clickOnMarker();
    	}, function (oldValue, newValue) {
			if (newValue.key != null) {
				var obj = { id: newValue.key };
				obj[newValue.key] = true;
				//Set open accordion
				$scope.openAccordion = obj;
				//Scroll to area
				scrollTo.classId('rightbar', newValue.key);
			};
    	});
	}

	$scope.displayMap = function($url){
		return $url;
	}

	$scope.focusOnSchool = function(school){
		mapService.focusOnParseLocation(school);
	}

	//Open modal for preview
	$scope.name = 'theNameHasBeenPassed';
	
	$scope.showModal = function(url, areaName, mapName) {
	  
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
	      						pdfUrl: '/dev/images/icons/fish.png',
	      						areaName: areaName,
	      						mapName: mapName }); // pass name to Dialog
	  }
	  
	    var modalInstance = $modal.open($scope.opts);
	    
	    modalInstance.result.then(function(){
	      //on ok button press 
	    },function(){
	      //on cancel button press
	      console.log("Modal Closed");
	    });
	}; 

		//Init controller
	var init = function () {
		$scope.openAccordion = {};
		watchClick();
	};

	//Init function
	init();

	//Remove watchers when view is unloaded
	$scope.$on("$destroy", function(){
        watchClick();
    });


});