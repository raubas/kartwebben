Parse.initialize("6xK5z0dd13fPSziUDvcLiZTEqjkRc5qQais6zUSo", "dgHEctNMXBRjHFAYSSBZ7nnLfbuI46NSQEronPP8");
var app = angular.module('myApp', ['ngAnimate', 'parse-angular','nya.bootstrap.select', 'uiGmapgoogle-maps', 'geolocation', 'ui.bootstrap']);

app.run(function($rootScope) {
 
    Parse.User.logOut();
 	
    $rootScope.sessionUser = Parse.User.current();
 
});

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: ''
    });
})

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
	
})

app.directive('dropzone', function(){
	// Runs during compile
	return function (scope, element, attrs) {
    var config, dropzone;

    config = scope[attrs.dropzone];

    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);

    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
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
