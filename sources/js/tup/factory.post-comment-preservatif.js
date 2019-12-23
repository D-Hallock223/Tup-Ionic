tupModule.factory( 'signalPlaceFactory', function( $http, globalFunctionService ) {
	return {
		signalPlace: function( data, type ) {			
			return $http
				.post( globalFunctionService.getBaseWsUrl() + 'post-comment-' + type, data, {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
					}})
				.then( function( response ) {
						return response;
					},
					function( err ) {
						globalFunctionService.notificationAlert( "Une erreur est survenue lors de la sauvegarde des données. Veuillez vérifier votre connexion Internet", false, 'Erreur de connexion', 'OK'  );
						return false;
					}
				);
		}
	};
});