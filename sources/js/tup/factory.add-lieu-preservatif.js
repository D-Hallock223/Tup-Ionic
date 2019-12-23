tupModule.factory( 'newPreservatifPlaceFactory', function( $http, globalFunctionService ) {
	return {
		setLieu: function( data ) {
			return $http
				.post( globalFunctionService.getBaseWsUrl() + 'add-lieu-preservatif', data, {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
					}})
				.then( function( response ) {
						return response;
					}, function( err ) {
						globalFunctionService.notificationAlert( "Une erreur est survenue lors de la sauvegarde des données. Veuillez vérifier votre connexion Internet", false, 'Erreur de connexion', 'OK'  );
						return false;
					}
				);
		}
	};
});