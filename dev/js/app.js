Parse.initialize("6xK5z0dd13fPSziUDvcLiZTEqjkRc5qQais6zUSo", "dgHEctNMXBRjHFAYSSBZ7nnLfbuI46NSQEronPP8");
var app = angular.module('myApp', ['ngAnimate', 'parse-angular','nya.bootstrap.select', 'uiGmapgoogle-maps', 'geolocation', 'ui.bootstrap', 'ui.router','xeditable','ngFileUpload']);

app.run(function ($rootScope, $location, $state, userManagement, editableOptions) {

	editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
 	
 	//Log out user for dev purposes
    //Parse.User.logOut();
 	userManagement.userState();

 	//Save user to rootscope
    $rootScope.sessionUser = Parse.User.current();

    $rootScope.$on('$stateChangeStart', function(event, toState) {
	    // don't check auth on login routes
        $rootScope.$broadcast('stateChange');
        if (toState.name == "divided.orientera" || toState.name == "span.ovningar") {
        	console.log('tillåten sida');
        } else {
        	console.log('förbjuden sida');
            if (!userManagement.userState()) {
                console.log('redirect');
                event.preventDefault();
                $state.go('divided.orientera');
                return;
            }
        }
  	});
});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: ''
    });
});


app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
 
    $stateProvider
        .state('divided', {
        	url: '/divided',
        	templateUrl: 'components/divided.html'
        })

        .state('divided.orientera', {
        	url: '/orientera',
    		views: { 
        		'map' : {
            		templateUrl: 'components/map.html',
	            	controller: 'mapCtrl'
            	},
	            'list' : {
	            	templateUrl: 'pages/orientera.html',
	            	controller: 'orienteraCtrl'
	            }
	        } 
        })

        .state('divided.skolor', {
        	url: '/skolor',
    		views: { 
        		'map' : {
            		templateUrl: 'components/map.html',
	            	controller: 'mapCtrl'
            	},
	            'list' : {
	            	templateUrl: 'pages/skolor.html',
	            	controller: 'skolorCtrl'
	            }
	        } 
        })

        .state('divided.kartor', {
        	url: '/kartor',
    		views: { 
        		'map' : {
            		templateUrl: 'components/map.html',
	            	controller: 'mapCtrl'
            	},
	            'list' : {
	            	templateUrl: 'pages/kartor.html',
	            	controller: 'uploadMapCtrl'
	            }
	        } 
        })

        .state('span', {
        	url:'/span',
        	templateUrl: 'components/span.html',
        })

        .state('span.ovningar', {
        	url:'/ovningar',
        	templateUrl: 'pages/ovningar.html',
        })

	$urlRouterProvider.otherwise('/divided/orientera');
 
});

app.service('userManagement', function($rootScope, $state){
	this.logIn = function(username, password){
		console.log(username + ' : ' + password);
		Parse.User.logIn(username, password, {
		  success: function(user) {
		    // Do stuff after successful login.
		    console.log('login!');
		    broadCastState();
		    return;
		  },
		  error: function(user, error) {
		    // The login failed. Check error to see why.
		    console.log('ojoj!');
		    broadCastState();
		    return;
		  }
		});
	}
	
	this.logOut = function(){
		console.log('logut!');
		Parse.User.logOut();
		$state.go('divided.orientera');
		broadCastState();
		return;
	}

	this.userState = function(){
		var currentUser = Parse.User.current();
		return currentUser;
	}

	var broadCastState = function(){
		$rootScope.$broadcast('stateChange');
	}
	
});

app.service('mapService', function(){
	//Config map
	var map = 	{ 	center: { latitude: 65.588946, longitude: 22.157324 },
					zoom: 14,
					options: { scrollwheel: false }
				};
	var clickedMarker = {};

	//Get map
	var getMap = function(){
		return map;
	};

	//Takes Parse object with location
	// var focusOnParseLocation = function(object){
	// 	map.center = { 	latitude: object.attributes.position._latitude,
	// 					longitude: object.attributes.position._longitude };
	// 	map.zoom = 12;
	// 	focusOnLocation(map);
	// }

	//Takes object with { lat, long }
	var focusOnObjectLocation = function(object){
		map.center = { 	latitude: object.latitude,
						longitude: object.longitude };
		map.zoom = 14;
		focusOnLocation(map);
	}

	//Listener for map focus events
	var focusOnLocation = function(mapObject){
		if (mapObject != null) {
			map = mapObject;
		};
		return map;
	}

	//Register click-events on markers
	var clickOnMarker = function(object){
		if (object != null) {
			clickedMarker = object;
		};
	}

	//Register listener for click-events
	var listenForClick = function(){
		if (clickedMarker != null) {
			return clickedMarker;
		};
	}

	//Expose functions to controllers
	return {
	    getMap: getMap,
	    // focusOnParseLocation: focusOnParseLocation,
	    focusOnObjectLocation: focusOnObjectLocation,
	    focusOnLocation: focusOnLocation,
	    clickOnMarker: clickOnMarker,
	    listenForClick: listenForClick

	};

});

app.service('markerService', function ($filter){
	var areaMarkers = [];
	var schoolMarkers = [];
	var draggableMarker = {};

	var addDraggableMarker = function(object) {
		draggableMarker = 	{	coords: { 	latitude: object.latitude,
											longitude: object.longitude },
								options: { 	draggable: true,
											labelContent: 'Dra mig till rätt position!',
							    			labelAnchor: "75 100",
											labelClass: "draggable-marker-label",
											icon: '/dev/images/icons/drag.png',
											animation: google.maps.Animation.DROP }
							};
	};

	var removeDraggableMarker = function(){
	  return draggableMarker = {};
	};

	var getDraggableMarker = function(object){
		if (object != null) {
			draggableMarker = object;
			return draggableMarker;
		};
		if (draggableMarker != null) {
			return draggableMarker;
		};
	}

	var addToAreaMarkerArray = function(object){
		var areaInMarkerArray = $filter('filter')(areaMarkers, { id: object.id }, true)[0];
		if (areaInMarkerArray) {
			areaMarkers.splice(areaMarkers.indexOf(areaInMarkerArray), 1);
		}
		var marker = {
					latitude: object.attributes.position._latitude,
					longitude: object.attributes.position._longitude,
					title: object.attributes.name,
					options: { animation: google.maps.Animation.DROP, labelContent: object.attributes.name, labelAnchor:'50 75', labelClass:'marker-label' }
				};
		marker['id'] = object.id;
		areaMarkers.push(marker);

	};

	var removeFromAreaMarkerArray = function(object){
		//Find current marker, delete from area markers
		var areaInMarkerArray = $filter('filter')(areaMarkers, { id: object.id }, true)[0];
		if (areaInMarkerArray) {
			areaMarkers.splice(areaMarkers.indexOf(areaInMarkerArray), 1);
		};
	};

	var getAreaMarkerArray = function(){
	  return areaMarkers;
	};

	var addToSchoolMarkerArray = function(object){
		var schoolInMarkerArray = $filter('filter')(schoolMarkers, { id: object.id }, true)[0];
		if (schoolInMarkerArray) {
			schoolMarkers.splice(schoolMarkers.indexOf(schoolInMarkerArray), 1);
		}
		var marker = {
				latitude: object.attributes.position._latitude,
				longitude: object.attributes.position._longitude,
				title: object.attributes.name,
				options: { animation: google.maps.Animation.DROP, labelContent: object.attributes.name, labelAnchor:'50 75', labelClass:'marker-label' }
			};
		marker['id'] = object.id;
		schoolMarkers.push(marker);
  	};

  	var removeFromSchoolMarkerArray = function(object){
		//Find current marker, delete from school markers
		var schoolInMarkerArray = $filter('filter')(schoolMarkers, { id: object.id }, true)[0];
		if (schoolInMarkerArray) {
			schoolMarkers.splice(schoolMarkers.indexOf(schoolInMarkerArray), 1);
		};
	};

  	var getSchoolMarkerArray = function(){
  		return schoolMarkers;
  	}
  
	return {
		addDraggableMarker: addDraggableMarker,
		removeDraggableMarker: removeDraggableMarker,
		getDraggableMarker: getDraggableMarker,
		addToAreaMarkerArray: addToAreaMarkerArray,
		getAreaMarkerArray: getAreaMarkerArray,
		removeFromAreaMarkerArray: removeFromAreaMarkerArray,
		addToSchoolMarkerArray: addToSchoolMarkerArray,
		getSchoolMarkerArray: getSchoolMarkerArray,
		removeFromSchoolMarkerArray: removeFromSchoolMarkerArray
	};

});

app.directive('emitWhen', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var params = scope.$eval(attrs.emitWhen),
                event = params.event,
                condition = params.condition;
            if (condition) {
                scope.$emit(event, condition);
            }
        }
    };
});

app.factory('scrollTo', function (){
	return {
		classId: function(container, anchor){
		    var element = angular.element('#'+anchor);
		    if (element[0]) {
		    	angular.element('.'+container).animate({scrollTop: element.offset().top}, "slow");
		    };
		},
		idClass: function(container, anchor){
			var element = angular.element('.'+anchor);
			if (element[0]) {
				angular.element('#'+container).animate({scrollTop: element.offset().top}, "slow");
			};
		}
	};
});

app.service('PDFToPNG', function ($q){

	var pdfFile;
	var fitScale = 1;
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	if (!window.requestAnimationFrame) {
	  window.requestAnimationFrame = (function() {
	    return window.webkitRequestAnimationFrame ||
	      window.mozRequestAnimationFrame ||
	      window.oRequestAnimationFrame ||
	      window.msRequestAnimationFrame ||
	      function(callback, element) {
	        window.setTimeout(callback, 1000 / 60);
	      };
	  })();
	}

	var openPage = function(pdfFile) {

		var deferred = $q.defer();
	    pdfFile.getPage(1).then(function(page) {
	      var scale = 1;
	      viewport = page.getViewport(scale);

	      canvas.height = viewport.height;
	      canvas.width = viewport.width;

	      var renderContext = {
	        canvasContext: context,
	        viewport: viewport
	      };
	      //Step 1: store a refer to the renderer
	      var pageRendering = page.render(renderContext);
	      //Step : hook into the pdf render complete event
	      var completeCallback = pageRendering.internalRenderTask.callback;
	      pageRendering.internalRenderTask.callback = function (error) {
	        //Step 2: what you want to do before calling the complete method                  
	        completeCallback.call(this, error);
	        //Step 3: do some more stuff
	        var dataURL = canvas.toDataURL("image/png");
	      	deferred.resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
	      };

	    });
	    return deferred.promise;
	  };

	  var makePNG = function(pdf){
	  	var deferred = $q.defer();
	    PDFJS.disableStream = true;
	    read = new FileReader();
	    read.onload = function() {
	      PDFJS.getDocument(read.result).then(function(pdf) {
	        pdfFile = pdf;

	        openPage(pdf).then(function(base64Img){
	        	deferred.resolve(base64Img);
	        });
	        
	      });
	    }
	    read.readAsArrayBuffer(pdf);
	    return deferred.promise;
	  };

	  return {
		makePNG: makePNG
	};

})


var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item) {
    
	$scope.item = item;

	$scope.ok = function () {
		$modalInstance.close($scope);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}
