tupModule.controller( 'signalPoiConfirmContoller', function( $scope, $rootScope, $stateParams ) {
	$scope.type	= $stateParams.type;
	
	$scope.trackEvents = function( action, label ) {
		if( $scope.type =='preservatif' )
			$rootScope.gaTrackEvent( 'TUP', action, label );
		else
			$rootScope.gaTrackEvent( 'TULD', action, label );
	}
	
	if( typeof analytics !== 'undefined' ) {
		if( $scope.type =='preservatif' )
			analytics.trackView( 'Trouver un préservatif - Signaler - Merci' );
		else
			analytics.trackView( 'Trouver un lieu de dépistage - Signaler - Merci' );
	}
});