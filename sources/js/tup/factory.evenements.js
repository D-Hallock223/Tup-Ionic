tupModule.factory( 'eventsFactory', function( $http, localStorageService, globalFunctionService ) {
	return {
		getEvents: function() {
			return $http
				.get( globalFunctionService.getBaseWsUrl() + 'evenements' )
				.then( function( response ) {
						var events = response.data;
						localStorageService.set( 'events', events );
						return events;
					}, function( response ) {
						globalFunctionService.notificationAlert( "Une erreur est survenue lors de la récupération des informations. Veuillez vérifier votre connexion Internet", false, 'Erreur de connexion', 'OK'  );
						return false;
					}
				);
		}
	};
});