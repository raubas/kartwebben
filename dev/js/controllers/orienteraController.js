app.controller('orienteraCtrl', function ($scope, $modal, $filter, mapService, markerService, scrollTo, mobileHider){


	//Get areas from db
	var query = new Parse.Query("Areas");
	query.include("maps");
	query.ascending("name");
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

	$scope.displayMap = function($url){
		return $url;
	}

	// $scope.focusOnSchool = function(school){
	// 	mapService.focusOnParseLocation(school);
	// }

	//Open modal for preview
	$scope.name = 'theNameHasBeenPassed';

	$scope.showModal = function(previewUrl, pdfUrl, areaName, mapName) {

	  $scope.opts = {
		  backdrop: true,
		  backdropClick: true,
		  dialogFade: false,
		  keyboard: true,
		  templateUrl : 'components/mapPreviewModal.html',
		  controller : ModalInstanceCtrl,
		  resolve: {} // empty storage
	    };


	  $scope.opts.resolve.item = function() {
	      return angular.copy({	previewUrl: previewUrl,
	      						pdfUrl: pdfUrl,
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

	$scope.hideRightbar = function() {
		mobileHider.setRightbarVisibility(false);
		mobileHider.setMapVisibility(true);
		console.log("kallas hideRightbar?")
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
		$scope.openAccordion = {};
		watchClick();
		watchVisibility();
	};

	//Init function
	init();

	//Remove watchers when view is unloaded
	$scope.$on("$destroy", function(){
        watchClick();
        watchVisibility();
    });


});
