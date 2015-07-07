Parse.initialize("6xK5z0dd13fPSziUDvcLiZTEqjkRc5qQais6zUSo", "dgHEctNMXBRjHFAYSSBZ7nnLfbuI46NSQEronPP8");

angular.module('myApp', ['ngAnimate', 'parse-angular']);

// Queries
var query = new Parse.Query("Schools");
query.equalTo("name", "Uppsala Universitet");
query.first()
.then(function(result){
        $scope.monsters = result;
});