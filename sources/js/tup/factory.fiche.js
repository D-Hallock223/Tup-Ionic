tupModule.factory( 'fichesFactory', function( $http, Slug, globalFunctionService ) {
	return {
		getFiches: function() {
			return $http
				.get( globalFunctionService.getBaseWsUrl() + 'fiches' )
				.then( function( response ) {
						var fiches = response.data;
						
						var fichesParse = {};
						
						// Create final object
						fiches.forEach( function( item, key ) {
							var catless = Slug.slugify( item.categorie );
							
							if( !fichesParse[ catless ] )
								fichesParse[ catless ] = [];
							
							fichesParse[ catless ].push( item );
						});
						
						// Order item by position
						fichesParse[ 'contraception_et_vaccins' ].sort( function( a, b ) { return a.position - b.position } );
						fichesParse[ 'depistage' ].sort( function( a, b ) { return a.position - b.position } );
						fichesParse[ 'ist_infections_sexuellement_transmissibles' ].sort( function( a, b ) { return a.position - b.position } );
						fichesParse[ 'preservatif_masculin_et_feminin' ].sort( function( a, b ) { return a.position - b.position } );
						fichesParse[ 'tpe_traitement_post_exposition' ].sort( function( a, b ) { return a.position - b.position } );
						
						return fichesParse;
					}, function( response ) {
						globalFunctionService.notificationAlert( "Une erreur est survenue lors de la récupération des informations. Veuillez vérifier votre connexion Internet", false, 'Erreur de connexion', 'OK'  );
						return false;
					}
				);
		}
	};
});