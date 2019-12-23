tupModule.controller( 'poiContoller', function( $scope, $stateParams, globalFunctionService, $state, $rootScope, $ionicViewSwitcher, $ionicScrollDelegate, $timeout, $ionicHistory ) {
	$scope.type 		= $stateParams.type;
	$scope.onScrolling 	= false;
	var id = $stateParams.id;
	if( id && !isNaN( id ) ) {
		$timeout( function() {
			$scope.item = globalFunctionService.getPlaceFromId( id, $scope.type );
			$scope.current_timewalk = $scope.item.timewalk;
			
            if( $scope.type =='preservatif' ) {
                if( $scope.item.horaires ) {
                    $scope.horaires = globalFunctionService.transformHorairesPoi( $scope.item.horaires );
                }
            }
            else {
                if( $scope.item.type_depistage && $scope.item.type_depistage.length > 0 ) {
                    $scope.horaires = globalFunctionService.transformHorairesPoiDepistage( $scope.item.type_depistage );
                }
            }
			
			if( typeof analytics !== 'undefined' ) {
				if( $scope.type =='preservatif' )
					analytics.trackView( 'Trouver un préservatif - Fiche - ' + $scope.item.nom );
				else
					analytics.trackView( 'Trouver un lieu de dépistage - Fiche - ' + $scope.item.nom );
			}
		}, 0);
	}
	
	// Click for itineraire
	$scope.goItineraire = function() {
		launchnavigator.navigate(
			[ $scope.item.latitude, $scope.item.longitude ],
			null,
			function(){ ; },
			function(error){
				globalFunctionService.notificationAlert( "Une erreur est survenue lors du lancement de l'itinéraire", false, 'Erreur', 'OK'  );
			}
		);
	}
	
	$scope.scrollOnPage = function() {
		$scope.$apply( function() {
			if( $ionicScrollDelegate.getScrollPosition().top !== 0 )
				$scope.onScrolling = true;
			else
				$scope.onScrolling = false;
		});
	}
	
	$scope.trackEvents = function( action, label, value ) {
		var cat = '';
		if( $scope.type =='preservatif' )
			cat = 'TUP';
		else
			cat = 'TULD';

		if( !label && !value )
			$rootScope.gaTrackEvent( cat, action );
		else if( label && !value )
			$rootScope.gaTrackEvent( cat, action, label );
		else if( label && value )
			$rootScope.gaTrackEvent( cat, action, label, value );
	}
	
	// Click on back button
	$rootScope.goBackCustom = function() {
        $ionicHistory.goBack();
		//$ionicViewSwitcher.nextDirection( 'back' );
		//$state.go( 'app.map_id', { type: $scope.type, id: id, reload: true } );
	};
});