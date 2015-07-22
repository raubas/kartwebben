app.controller('uploadMapCtrl', function($scope){

	var query = new Parse.Query("Areas");
		query.include("maps");
		query.find().then(function(result){
	        $scope.areeas = result;
	    });


	// var queryContact = new Parse.Query("ContactPerson");
	// 	queryContact.include('ContactPerson');
	// 	queryContact.find().then(function(result){
	//         $scope.contactPerson = result;
	//     });

	// // Queries
	// $scope.doQuery = function(){
	// 	var query = new Parse.Query("Schools");
	// 	query.find().then(function(result){
	//         $scope.schools = result;
	// });
	// }
	

});