tupModule.factory( 'placesFactory', function( $rootScope, $http, localStorageService, Slug, globalFunctionService ) {
	return {
		getPlaces: function( type, lat1, lng1, lat2, lng2, pos1, pos2 ) {
			return $http
				.get( globalFunctionService.getBaseWsUrl() + type + '/' + lat1 + '/' + lng1 + '/' + lat2 + '/' + lng2 + '/' + pos1 + '/' + pos2 )
				.then(
					function( response ) {
						try {
							var tmp = response.data.replace(/(\r\n|\n|\r)/gm,"");
							var tmpBugClient = tmp.split( '</table></font>' );
							var places = JSON.parse( tmpBugClient[ tmpBugClient.length - 1] );
						} catch( e ) {
							var places = response.data;
						}
						
						var goodPlaces = [];
						places.forEach( function( item, key ) {
							var typeless = Slug.slugify( item.type );
							var folderIco = ( item.operation ) ? 'svg_operation' : 'svg_normal';
							
							if( item.operation && !item.id && item.operation.type ) {
								// Rebind for operation speciale from distributeur
								typeless 					= Slug.slugify( item.operation.type );
								places[ key ].id 			= item.operation.id;
								places[ key ].latitude		= item.operation.latitude;
								places[ key ].longitude		= item.operation.longitude;
								places[ key ].nom			= item.operation.nom;
								places[ key ].adresse1		= item.operation.adresse1;
								places[ key ].adresse2		= item.operation.adresse2;
								places[ key ].codePostal	= item.operation.codePostal;
								places[ key ].ville			= item.operation.ville;
								places[ key ].telephone		= item.operation.telephone;
							}
							
                            places[ key ].informations	= item.informations;
							places[ key ].typeless 	= typeless;
							places[ key ].folderIco = folderIco;
							//places[ key ].icon 		= 'img/map/' + typeless + '.png';
							places[ key ].icon 		= {
								//url			: 'img/map/' + folderIco + '/' + typeless + '.svg',
								url			: 'img/map/' + folderIco + '/' + typeless + '.png',
								scaledSize	: new google.maps.Size( 32 * $rootScope.pixelRatio, 36.35 * $rootScope.pixelRatio ),
								origin		: new google.maps.Point( 0, 0 ),
								anchor		: new google.maps.Point( 16 * $rootScope.pixelRatio, 13.63125 * $rootScope.pixelRatio )
							};
							places[ key ].distance	= item.distance * 1000;
							
							var timewalk	= places[ key ].distance / 60;
							if( timewalk < 60 ) {
								places[ key ].timewalk = Math.floor( timewalk ) + " min";
							}
							else {
								places[ key ].timewalk = Math.floor( timewalk / 60 ) + "h";
								if( Math.floor( timewalk % 60) > 0 ) {
									places[ key ].timewalk = places[ key ].timewalk + Math.floor( timewalk % 60 );
								}
							}

							if( item.etat ) {
								if( places[ key ].id && item.etat.indexOf( 'Valid' ) !== -1 ) {
									goodPlaces.push( places[ key ] );
								}
							}
						});

						goodPlaces.sort( function( a, b ) { return a.distance - b.distance } );

						// Define displayPlaces
						var displayPlaces = [];
						goodPlaces.forEach( function( item, key ) {
							if( item.latitude < lat1 && item.latitude > lat2 && item.longitude > lng1 && item.longitude < lng2 ) {
								displayPlaces.push( item );
							}
						});
						
						localStorageService.set( 'displayPlaces' + type, displayPlaces );
						
						return { places : goodPlaces, displayPlaces : displayPlaces }
					}, function( response ) {
						globalFunctionService.notificationAlert( "Une erreur est survenue lors de la récupération des informations. Veuillez vérifier votre connexion Internet", false, 'Erreur de connexion', 'OK'  );
					}
				);
		}
	};
});