tupModule.controller( 'addPoiValidationContoller', function( $scope, $rootScope, localStorageService, $ionicHistory, newPreservatifPlaceFactory, $state, globalFunctionService ) {
	$scope.lieu = localStorageService.get( 'newPoi' );
	if( $scope.lieu.horaires ) {
		$scope.horaires = globalFunctionService.transformHorairesPoi( $scope.lieu.horaires );
	}
	
	$scope.changeLieu = function() {
		$ionicHistory.goBack();
	}
	
	$scope.submitLieu = function() {
		var newLieu = $scope.lieu;
		
		newLieu.horaires.forEach( function( item, key ) {
			newLieu.horaires[ key ].horaire1 = item.horaire1.replace( ':', 'h' );
			newLieu.horaires[ key ].horaire2 = item.horaire2.replace( ':', 'h' );
			newLieu.horaires[ key ].horaire3 = item.horaire3.replace( ':', 'h' );
			newLieu.horaires[ key ].horaire4 = item.horaire4.replace( ':', 'h' );
		});
		
		newPreservatifPlaceFactory.setLieu( newLieu )
		.then( function( response ) {
			if( response.status == 200 ) {
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
				$state.go( 'app.add_poi_confirmation' );
			}
			else
				globalFunctionService.notificationAlert( "Une erreur est survenue lors de l'ajout du lieu : " + response.message, false, 'Erreur', 'OK'  );
		}, function( err ) {
			globalFunctionService.notificationAlert( "Une erreur est survenue lors de l'ajout du lieu : " + err.message, false, 'Erreur', 'OK'  );
		});
	};
	
	// Click on back button
	$rootScope.goBackCustom = function() {
		$ionicHistory.goBack();
	};
	
	if( typeof analytics !== 'undefined' )
		analytics.trackView( 'Trouver un préservatif - Ajout - Confirmation' );
});