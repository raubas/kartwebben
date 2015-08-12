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
	            	controller: 'findMapsCtrl'
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
	            	controller: 'schoolCtrl'
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

        .state('span.traning', {
        	url:'/traning',
        	templateUrl: 'components/ovning.html',
        })



    $urlRouterProvider.otherwise('/divided/orientera');
 
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
	var map = 	{ 	center: { latitude: 65.588946, longitude: 22.157324 },
					zoom: 12,
					pan: {val: true}
				};
	var getMap = function(){
		return map;
	};

	var focusOnLocation = function(object){
		

	}

	return {
	    getMap: getMap
	};

});

app.service('markerService', function ($filter){
	var areaMarkers = [];
	var schoolMarkers = [];

	var addDraggablePin = function(newObj) {
	  
	  productList.push(newObj);
	};

	var removeDraggablePin = function(){
	  return productList;
	};

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

	var removeFromAreaMarkerArray = function(){

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
    addToAreaMarkerArray: addToAreaMarkerArray,
    getAreaMarkerArray: getAreaMarkerArray,
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
		    angular.element('.'+container).animate({scrollTop: element.offset().top}, "slow");
		},
		idClass: function(container, anchor){
			var element = angular.element('.'+anchor);
		    angular.element('#'+container).animate({scrollTop: element.offset().top}, "slow");
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
