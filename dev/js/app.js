Parse.initialize("6xK5z0dd13fPSziUDvcLiZTEqjkRc5qQais6zUSo", "dgHEctNMXBRjHFAYSSBZ7nnLfbuI46NSQEronPP8");
var app = angular.module('myApp', ['ngAnimate', 'parse-angular','nya.bootstrap.select', 'uiGmapgoogle-maps', 'geolocation', 'ui.bootstrap', 'ui.router']);

app.run(function($rootScope, $location) {
 	
 	//Log out user for dev purposes
    //Parse.User.logOut();
 	
 	//Save user to rootscope
    $rootScope.sessionUser = Parse.User.current();

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
        .state('start', {
            url:'/',
            views: {
            	map:{
            		templateUrl: 'components/map.html',
	            	controller: 'mapCtrl'
            	},
            	content:{
	            	templateUrl: 'pages/start.html',
	            	controller: 'findMapsCtrl'
	            }
	        }
        })
        .state('kartor', {
            url:'/kartor',
            views: {
            	map:{
            		templateUrl: 'components/map.html',
	            	controller: 'mapCtrl'
            	},
            	content:{
	            	templateUrl: 'pages/kartor.html',
	            	controller: 'uploadMapCtrl'
	            }
	        }
        });
        // .state('kartor', {
        //     url:'/kartor',
        //     templateUrl: 'pages/kartor.html',
        //     controller: 'uploadMapCtrl'
        // })
        // .state('skolor', {
        //     url:'/skolor',
        //     templateUrl: 'pages/skolor.html',
        //     controller: 'schoolCtrl'
        // });
 
});

app.service('userManagement', function($rootScope){
	this.logIn = function(username, password){
		console.log(username + ' : ' + password);
		Parse.User.logIn(username, password, {
		  success: function(user) {
		    // Do stuff after successful login.
		    console.log('login!');
		    $rootScope.sessionUser = Parse.User.current();
		    $rootScope.$broadcast('userState', { user: Parse.User.current() } );
		    return;
		  },
		  error: function(user, error) {
		    // The login failed. Check error to see why.
		    console.log('ojoj!');
		    $rootScope.sessionUser = Parse.User.current();
		    $rootScope.$broadcast('userState', { user: Parse.User.current() } );
		    return;
		  }
		});
	}
	
	this.logOut = function(){
		console.log('logut!');
		Parse.User.logOut();
		$rootScope.sessionUser = Parse.User.current();
		$rootScope.$broadcast('userState', { user: Parse.User.current() } );
		return;
	}
	
});

app.service('mapService', function(){
	//Config map
	var map = 	{ 	center: { latitude: 65.588946, longitude: 22.157324 },
					zoom: 12,
					pan: {val: true}
				};
	var clickedMarker = {};

	//Get map
	var getMap = function(){
		return map;
	};

	//Takes Parse object with location
	var focusOnParseLocation = function(object){
		map = { center: { 	latitude: object.attributes.position._latitude,
							longitude: object.attributes.position._longitude },
				zoom: 12 };
		focusOnLocation(map);
	}

	//Takes object with { lat, long }
	var focusOnObjectLocation = function(object){
		map = { center: { 	latitude: object.lat,
							longitude: object.long },
				zoom: 12 };
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
			return clickedMarker;
		};
		if (clickedMarker != null) {
			return clickedMarker;
		};
	}

	//Expose functions to controllers
	return {
	    getMap: getMap,
	    focusOnParseLocation: focusOnParseLocation,
	    focusOnObjectLocation: focusOnObjectLocation,
	    focusOnLocation: focusOnLocation,
	    clickOnMarker: clickOnMarker

	};

});

app.service('markerService', function ($filter){
	var areaMarkers = [];
	var schoolMarkers = [];
	var draggableMarker = {};

	var addDraggableMarker = function(object) {
		draggableMarker = 	{	coords: { 	latitude: object.lat,
											longitude: object.long },
								options: { 	draggable: true,
											labelContent: 'Dra mig till rätt position!',
							    			labelAnchor: "100 0",
											labelClass: "marker-labels",
											icon: '/dev/images/icons/fish.png' }
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
		if ($filter('filter')(areaMarkers, { id: object.id }, true)[0] == null ) {
			var marker = {
					latitude: object.attributes.position._latitude,
					longitude: object.attributes.position._longitude,
					title: object.attributes.name
				};
			marker['id'] = object.id;
			areaMarkers.push(marker);
		}
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
		if ($filter('filter')(schoolMarkers, { id: object.id }, true)[0] == null ) {
			var marker = {
					latitude: object.attributes.position._latitude,
					longitude: object.attributes.position._longitude,
					title: object.attributes.name
				};
			marker['id'] = object.id;
			schoolMarkers.push(marker);
		}
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
		getSchoolMarkerArray: getSchoolMarkerArray
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



var ModalInstanceCtrl = function($scope, $modalInstance, $modal, item) {
    
	$scope.item = item;

	$scope.ok = function () {
		$modalInstance.close($scope);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}
