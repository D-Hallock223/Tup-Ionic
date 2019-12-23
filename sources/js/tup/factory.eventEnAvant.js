tupModule.factory( 'eventsEnAvantFactory', function( $http, localStorageService, globalFunctionService ) {
	return {
		getEventsAvant: function() {
			return $http
				.get( globalFunctionService.getBaseWsUrl() + 'evenements-fiches-en-avant' )
				.then( function( response ) {
						var eventsAvant = response.data;
						
						eventsAvant.forEach( function( item, key ) {
							if( item.categorie ) {
								eventsAvant[ key ].type 	= 'bubbles_left';
								eventsAvant[ key ].title 	= 'Le saviez-vous ?';
								
								var cat = 0;
								if( item.categorie.indexOf( 'masculin' ) !== -1 )
									cat = 1;
								else if( item.categorie.indexOf( 'pistage' ) !== -1 )
									cat = 2;
								else if( item.categorie.indexOf( 'vaccin' ) !== -1 )
									cat = 3;
								else if( item.categorie.indexOf( 'exposition' ) !== -1 )
									cat = 4;
								else if( item.categorie.indexOf( 'sexuellement' ) !== -1 )
									cat = 5;
								
								eventsAvant[ key ].url 		= 'app.fiches_id({id: ' + eventsAvant[ key ].id + ', cat: ' + cat + '})';
							} else {
								var dateEvent 	= new Date( item.date_debut.split('+')[0] );
								var dateNow 	= new Date;

								//dateEvent 	= dateEvent.getFullYear().toString() + dateEvent.getMonth().toString() + dateEvent.getDate().toString();
								//dateNow 	= dateNow.getFullYear().toString() + dateNow.getMonth().toString() + dateNow.getDate().toString();
								
								if( dateEvent <= dateNow ) {
									eventsAvant[ key ].type 	= 'clock';
									eventsAvant[ key ].title 	= 'En ce moment';
								} else {
									eventsAvant[ key ].type 	= 'clock';
									eventsAvant[ key ].title 	= 'A venir';
								}

								eventsAvant[ key ].url 	= 'app.agenda_id({id: "item_' + eventsAvant[ key ].id + '"})';
							}
						});
						
						localStorageService.set( 'events_en_avant', eventsAvant );
						return eventsAvant;
					}, function( response ) {
						globalFunctionService.notificationAlert( "Une erreur est survenue lors de la récupération des informations. Veuillez vérifier votre connexion Internet", false, 'Erreur de connexion', 'OK'  );
						return false;
					}
				);
		}
	};
});