tupModule.controller( 'agendaContoller', function( $scope, $stateParams, localStorageService, eventsFactory, $ionicScrollDelegate ) {
	eventsFactory.getEvents().then( function( response ) {
		$scope.events = localStorageService.get( 'events' );

		var id = $stateParams.id;
		if( id ) {
			ionic.DomUtil.ready(function() {
				var itemTop = angular.element( document.querySelector( '#' + id ) )[0].offsetTop;
				if( itemTop ) {
					$ionicScrollDelegate.scrollTo( 0, itemTop, false );
				}
			});
		}
	});
	
	if( typeof analytics !== 'undefined' )
		analytics.trackView( 'Agenda' );
});