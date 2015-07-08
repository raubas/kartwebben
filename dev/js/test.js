Parse.initialize("6xK5z0dd13fPSziUDvcLiZTEqjkRc5qQais6zUSo", "dgHEctNMXBRjHFAYSSBZ7nnLfbuI46NSQEronPP8");

var app = angular.module('myApp', ['ngAnimate', 'parse-angular']);


app.controller('testController', function($scope){

	// Queries
	$scope.doQuery = function(){
		var query = new Parse.Query("Schools");
		query.find().then(function(result){
	        $scope.schools = result;
	});
	}
	

});

