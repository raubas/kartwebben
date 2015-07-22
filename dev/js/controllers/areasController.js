app.controller('areasCtrl', function($scope){

	//Get schools from database
	var query = new Parse.Query("Schools");
	query.find().then(function(result){
		$scope.schools = result;
	});

	$scope.difficulties = { 'one' : {name:'Åk 1', number:'1'},
							'two' : {name:'Åk 2', number:'2'},
							'three' : {name:'Åk 3', number:'3'}};
	
	$scope.setSchool = function ($school) {
		$scope.activeSchool = $school;
	}

	$scope.findAreas = function($difficulty){
		$scope.activeDifficulty = $difficulty;
		// var Area = Parse.Object.extend("Areas");
		// var query = new Parse.Query(Area);
		// query.containedIn("schools", ["57ibFeJ5PN"]);
		// query.include("Maps");
		// query.find().then(function(result){
		// 	$scope.areas = result;
		// 	$scope.findMaps(result);
		// 	console.log(result);
		// });

		//var School = Parse.Object.extend("ContactPerson");
		var schoolQuery = new Parse.Query("Schools");
		schoolQuery.equalTo("name", $scope.activeSchool.attributes.name);
		schoolQuery.include("areas", "areas.maps");
		schoolQuery.first().then(function(result){
			$scope.choosenSchool = result;
			console.log(result);
		});
	}

	$scope.findMaps = function($areas){
		//console.log($areas);
		$scope.mapsForSearch = [];
		angular.forEach($areas, function(value, key){
			angular.forEach(value.attributes.maps, function(value, key){
				$scope.mapsForSearch.push(value);
			})
		});
		var query = new Parse.Query("Maps");
		query.containedIn("objectId", $scope.mapsForSearch);
		query.find().then(function(result){
			$scope.maps = result;
			$scope.displayMaps();
		});
	}

	$scope.displayMap = function($url){
		return $url;
	}

});