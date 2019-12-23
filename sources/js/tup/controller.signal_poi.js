tupModule.controller( 'signalPoiContoller', function( $scope, $rootScope, $stateParams, globalFunctionService, signalPlaceFactory, $ionicViewSwitcher, $state, $ionicHistory, $ionicLoading ) {
	$scope.type		= $stateParams.type;
	
	
	var id = $stateParams.id;
	if( id && !isNaN( id ) ) {
		$scope.place = globalFunctionService.getPlaceFromId( id, $scope.type );
	}
	
	$scope.items = [{
		name	: "Adresse",
		icon	: "poi",
		active	: false,
		ga		: 'adresse'
	}, {
		name	: "Téléphone",
		icon	: "phone",
		active	: false,
		ga		: 'telephone'
	}, {
		name	: "Horaires",
		icon	: "clock",
		active	: false,
		ga		: 'horaires'
	}, {
		name	: "Ce lieu n'existe plus",
		icon	: "barriere",
		active	: false,
		ga		: 'noexiste'
	}];
	
	$scope.note = '';
	
	$scope.clicked = function( item ) {
		var findItem = _.findIndex( $scope.items, { 'name': item.name } );
		$scope.items[ findItem ].active = !$scope.items[ findItem ].active;
	}
	
	$scope.submitPoi = function() {
		$ionicLoading.show({
			template: 'Envoi en cours...'
		});
		var data = {
			id 			: id,
			type		: {
				1	: $scope.items[3].active,//$scope.items[0].active,
				2	: $scope.items[0].active,//$scope.items[1].active,
				3	: $scope.items[1].active,//$scope.items[2].active,
				4	: $scope.items[2].active,//$scope.items[3].active
			},
			commentaire	: $scope.note
		};
		signalPlaceFactory.signalPlace( data, $scope.type )
		.then( function( response ) {
			if( response.status == 200 ) {
				$ionicHistory.nextViewOptions({
					disableAnimate: true
				});
				$ionicLoading.hide();
				$state.go( 'app.signal_poi_confirm', { type: $scope.type } );
			} else
				globalFunctionService.notificationAlert( "Une erreur est survenue lors du signalement du lieu : " + response.message, false, 'Erreur', 'OK'  );
		}, function( err ) {
			globalFunctionService.notificationAlert( "Une erreur est survenue lors de l'ajout du lieu : " + err.message, false, 'Erreur', 'OK'  );
		});
	}
	
	$scope.trackEvents = function( action, label ) {
		if( $scope.type =='preservatif' )
			$rootScope.gaTrackEvent( 'TUP', action, label );
		else
			$rootScope.gaTrackEvent( 'TULD', action, label );
	}
	
	if( typeof analytics !== 'undefined' ) {
		if( $scope.type =='preservatif' )
			analytics.trackView( 'Trouver un préservatif - Signaler' );
		else
			analytics.trackView( 'Trouver un lieu de dépistage - Signaler' );
	}
    
	// Click on back button
	$rootScope.goBackCustom = function() {
        $ionicHistory.goBack();
		// $ionicViewSwitcher.nextDirection( 'back' );
		// $state.go( 'app.poi', { type: $scope.type, id: id } );
	};
});