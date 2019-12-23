tupModule.controller( 'mapContoller', function( $scope, $rootScope, $stateParams, localStorageService, uiGmapGoogleMapApi, $interval, globalFunctionService, placesFactory, $ionicSlideBoxDelegate, $timeout, $state, $ionicViewSwitcher, $ionicScrollDelegate ) {
	// Display loader
	$rootScope.openLoading();
	
	// Text on small footer
	$scope.txtFooter				= 'Chargement...';
	
	// Define type of map -> preservatif | depistage
	$scope.type 					= $stateParams.type;
	
	// Do you want to be localize ?
	$scope.enableGps	 			= true; //localStorageService.get( 'isGps' );
	
	// Interval to get current pos
	$scope.intWatchPosition 		= false;
	
	// Selected POI
	$scope.markerSelectedTmpKey		= false;
	
	// For btn
	$scope.gpsIsActive				= true;
	
	// Footer slidebox
	$scope.mySlideBox 				= $ionicSlideBoxDelegate.$getByHandle( 'googlemap' );
	
	// Map Object, include all
	$scope.iMap = {
		objects	: [],
		events	: {
			idle : function( e ) {
				// Load markers
				if( isMapLoad && e.zoom >= maxMapZoom && !$rootScope.isMenuOpener ) {
					$timeout( function() {
						$scope.iMap.markers.displayPlaces = false;
						getPlaces();
                        // $timeout( function() {
                        //     saveMapOnCache( e );
                        // }, 0);
				        localStorageService.set( 'myLat2', e.center.lat() );
				        localStorageService.set( 'myLng2', e.center.lng() );
					}, 0);
				}
			},
			click: function(e) {
				mapClosePoiSlider();
			},
			zoom_changed: function(e) {
				localStorageService.set( 'myLat2', e.center.lat() );
				localStorageService.set( 'myLng2', e.center.lng() );
                // $timeout( function() {
                //     saveMapOnCache( e );
                // }, 0);
				if( e.zoom >= maxMapZoom )
					$scope.txtFooter = 'Chargement...';
				else
					$scope.txtFooter = 'Afficher les résultats';
				
				clearWatchPosition();
				mapClosePoiSlider();
			},
			dragstart: function(e) {
				if( e.zoom >= maxMapZoom )
					$scope.txtFooter = 'Chargement...';
		
				clearWatchPosition();
				mapClosePoiSlider();
			},
			dragend: function(e) {
				localStorageService.set( 'myLat2', e.center.lat() );
				localStorageService.set( 'myLng2', e.center.lng() );
                // $timeout( function() {
                //     saveMapOnCache( e );
                // }, 0);
			}
		},
		mapOptions: {
			disableDefaultUI: true,
			minZoom: 5,
			styles: [
				{
					featureType: "poi",
					stylers: [{ visibility: "off" }]
				},{
					featureType: "transit.station",
					stylers: [{ visibility: "off" }]
				}
			]
		}
	}

	// Ask to watch GPS
	$scope.askToGps = function() {
		if( !$scope.gpsIsActive ) {
			$timeout( function() {
				$scope.gpsIsActive = true;
			}, 0);
			watchPosition( true );
		} else {
			$timeout( function() {
				$scope.gpsIsActive = false;
			}, 0);
			clearWatchPosition();
		}
	}
	
	// Slide on footer
	$scope.changeSizeMarker = function( index ) {
		changeSizeMarker( index );
	}
	
	// Click for itineraire
	$scope.goItineraire = function() {
		var displayPlaces = localStorageService.get( 'displayPlaces' + $scope.type );
		var item = displayPlaces[ $scope.markerSelectedTmpKey ];

		launchnavigator.navigate(
			[ item.latitude, item.longitude ],
			null,
			function(){ ; },
			function(error){
				globalFunctionService.notificationAlert( "Une erreur est survenue lors du lancement de l'itinéraire", false, 'Erreur', 'OK'  );
			}
		);
	}
	
	// Display / Hide SearchBox
	$scope.search = {
		text		: '',
		isEnable	: false
	}
	$scope.toggleSearchBox = function() {
		if( !$scope.search.isEnable )
			$scope.trackEvents( 'opensearch' );
		
		$scope.search.isEnable = !$scope.search.isEnable;
	}
	$scope.closeSearchBox = function() {
		if( $scope.search.text == '' ) {
			$scope.search.isEnable = !$scope.search.isEnable;
			$scope.trackEvents( 'searchcancel' );
		} else
			$scope.search.text = '';
	}
	$scope.searchAddress = function() {
		clearWatchPosition();
		$scope.markerSelectedTmpKey = false;
		$scope.txtFooter = 'Recherche...';
		
		$rootScope.openLoading( 'Recherche...' );
		
		$scope.trackEvents( 'searchgo' );
	
		geocoder.geocode( { "address": $scope.search.text }, function( results, status ) {
			if( status == google.maps.GeocoderStatus.OK && results.length > 0 ) {
				var location = results[0].geometry.location;
				if( location.lat() && location.lng() ) {
					$scope.toggleSearchBox();
					changeCenterMap( location.lat(), location.lng(), false, true );
                    // globalFunctionService.notificationAlert( "saveMapOnCache", false, 'Debug', 'OK'  );
                    // saveMapOnCache( $scope.iMap );
				} else {
					$rootScope.closeLoading();
					globalFunctionService.notificationAlert( "Une erreur est survenue lors de la recherche", false, 'Erreur de recherche', 'OK'  );
				}
			} else {
				$rootScope.closeLoading();
				globalFunctionService.notificationAlert( "Une erreur est survenue lors de la recherche", false, 'Erreur de recherche', 'OK'  );
			}
		});
		
		$rootScope.closeLoading();
	}
	
	// Show list of POI
	$scope.displayResult = function() {
		if( $scope.iMap.markers.displayPlaces ) {
			$scope.isMapListActivate = true;
			
			$scope.trackEvents( 'results' );
			
			if( typeof analytics !== 'undefined' ) {
				if( $scope.type =='preservatif' )
					analytics.trackView( 'Trouver un préservatif - Liste des lieux' );
				else
					analytics.trackView( 'Trouver un lieu de dépistage - Liste des lieux' );
			}
		}
	};
	
	// Go to Interface of new POI
	$scope.addDistribution = function() {
		var myLat = localStorageService.get( 'myLat' );
		var myLng = localStorageService.get( 'myLng' );
		
		if( myLat && myLng && $scope.enableGps ) {
			$rootScope.openLoading();
			
			var latlng = { lat: parseFloat( myLat ), lng: parseFloat( myLng ) };
			geocoder.geocode( { 'location': latlng }, function( results, status ) {
				if ( status === google.maps.GeocoderStatus.OK ) {
					if ( results[0] ) {
						var addr 			= results[0].address_components;
						var street_number 	= _.find( addr, function( obj ){ return obj.types[0] == 'street_number';});
						var route 			= _.find( addr, function( obj ){ return obj.types[0] == 'route';});
						var locality 		= _.find( addr, function( obj ){ return obj.types[0] == 'locality';});
						var postal_code 	= _.find( addr, function( obj ){ return obj.types[0] == 'postal_code';});

						var addrCache 		= ( ( street_number ) ? street_number.short_name : '' ) + ' ' + ( ( route ) ? route.short_name : '' ) + '||' + ( ( locality ) ? locality.short_name : '' ) + '||' + ( ( postal_code ) ? postal_code.short_name : '' );
						
						localStorageService.set( 'addrCache', addrCache );
						
						$rootScope.closeLoading();
						$state.go( 'app.add_poi' );
					} else {
						$rootScope.closeLoading();
						$state.go( 'app.add_poi' );
					}
				} else {
					$rootScope.closeLoading();
					$state.go( 'app.add_poi' );
				}
			});
		} else {
			$state.go( 'app.add_poi' );
		}
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
		$scope.trackEvents( 'retour' );
		
		if( $scope.isMapListActivate ) {
			var itemTop = angular.element(document.querySelector('#liste_poi') )[0].offsetTop;
			if( itemTop ) {
				$ionicScrollDelegate.scrollTo( 0, itemTop, false );
			}

			$timeout(function() {
				$scope.isMapListActivate = false;
			}, 0);
			
		} else {
			$ionicViewSwitcher.nextDirection( 'back' );
			$state.go( 'app.home' );
		}
	};

	// Do you return from POI's detail ?
	var poiId				= $stateParams.id || false;
	
	// Footer SlideBox
	var mySlideBox 			= $ionicSlideBoxDelegate.$getByHandle( 'googlemap' );
	
	// Get map from cache
	var myMap 				= localStorageService.get( 'map' + $scope.type );
	
	// Is map loaded
	var isMapLoad 			= false;
	
	// Interval instance to check map loading on loading
	var isMapLoadInterval	= false;
	
	// Search an address
	var geocoder = false;
	
	// Max zoom for refresh
	var maxMapZoom = 11;
	
	// Refresh User position and center of actual map
	var changeCenterMap = function( lat, lng, ignoreCenter, ignoreUser ) {
		$scope.$apply( function() {		
			if( !ignoreUser ) {
				setUserPosition();
				
				localStorageService.set( 'myLat', lat );
				localStorageService.set( 'myLng', lng );
			}

			if( !ignoreCenter ) {
                $scope.iMap.objects[ $scope.type ].center = { latitude : lat, longitude: lng };
                $timeout(function() {
					$scope.markerSelectedTmpKey = false;
					$scope.iMap.markers.displayPlaces = false;
                    getPlaces();
                }, 100);
            }
		});
	}

	// Save map on cache
	var saveMapOnCache = function( e ) {
		var objSave = {
			zoom: e.zoom,
			center: {
				latitude: e.center[ Object.keys( e.center )[0] ],
				longitude: e.center[ Object.keys( e.center )[1] ]
			},
			bounds: e.bounds
		};

		localStorageService.set( 'map' + $scope.type, objSave );
	}
	
	// Check if all params was instanciate to call correctly WS
	var checkMapBeforeGetPlaces = function() {
		try {
			var myMap = $scope.iMap.objects[ $scope.type ];
			if( myMap.bounds && ( $scope.iMap.markers.position[0].latitude || $scope.iMap.objects[ $scope.type ].center.latitude ) && ( $scope.iMap.markers.position[0].longitude || $scope.iMap.objects[ $scope.type ].center.longitude ) ) {
				if( myMap.bounds.northeast && myMap.bounds.southwest ) {
					if( myMap.bounds.northeast.latitude && myMap.bounds.southwest.longitude && myMap.bounds.southwest.latitude && myMap.bounds.northeast.longitude ) {
						return true;
					} else { return false; }
				} else { return false; }
			} else { return false; }
		} catch( e ) { return false; }
	}
	
	// Load places from WS
	var getPlaces = function() {
		var myLat 			= $scope.iMap.markers.position[0].latitude || $scope.iMap.objects[ $scope.type ].center.latitude;
		var myLng 			= $scope.iMap.markers.position[0].longitude || $scope.iMap.objects[ $scope.type ].center.longitude;
		try {
			placesFactory.getPlaces( $scope.type, $scope.iMap.objects[ $scope.type ].bounds.northeast.latitude, $scope.iMap.objects[ $scope.type ].bounds.southwest.longitude, $scope.iMap.objects[ $scope.type ].bounds.southwest.latitude, $scope.iMap.objects[ $scope.type ].bounds.northeast.longitude, myLat, myLng ).then( function( response ) {
				// Get places
				var places = response.places;

				// Add POI to map
				$scope.iMap.markers.places[ $scope.type ] = [];
				places.forEach( function( item, key ) {
					$scope.iMap.markers.places[ $scope.type ].push({
						id				: item.id,
						latitude		: item.latitude,
						longitude		: item.longitude,
						title			: item.nom,
						icon			: item.icon
					});
				});

				var displayPlaces = response.displayPlaces;
				if( displayPlaces.length == 0 ) {
					$timeout( function() {
						//globalFunctionService.notificationAlert( "Aucune place", false, 'Debug', 'OK'  );
						$scope.markerSelectedTmpKey = false;
						$scope.iMap.markers.displayPlaces = false;
						$scope.txtFooter = 'Aucun résultat';
						$rootScope.closeLoading();
					}, 100);
				} else {
					$scope.iMap.markers.displayPlaces = [];
					displayPlaces.forEach( function( item, key ) {
						$scope.iMap.markers.displayPlaces.push( item );
					});
					
					$scope.txtFooter = 'Afficher les résultats';
					var currentPoi = ( poiId ) ? globalFunctionService.getPlaceFromId( poiId, $scope.type, 'key' ) || 0 : 0;
					changeSizeMarker( currentPoi );
					
					$timeout( function() {
						$scope.mySlideBox.update();
						
						$timeout( function() {
							$scope.mySlideBox.update();
							if( !poiId )
								$scope.mySlideBox.slide( 0 );
							else
								$scope.mySlideBox.slide( currentPoi );
							
							$scope.mySlideBox.update();
							poiId = false;
						}, 10);
					}, 10);
					
					$rootScope.closeLoading();
				}
			});
		} catch( e ) { $rootScope.closeLoading(); }
	}
	
	// Change size of Markers
	var changeSizeMarker = function( key, isTrackEvent ) {
		if( isTrackEvent )
			$scope.trackEvents( 'swipe' );
		
		if( $scope.markerSelectedTmpKey || $scope.markerSelectedTmpKey === 0 ) {
			var icon = $scope.iMap.markers.places[ $scope.type ][ $scope.markerSelectedTmpKey ].icon.url;
			icon = icon.replace( '_selected', '' );
			$scope.iMap.markers.places[ $scope.type ][ $scope.markerSelectedTmpKey ].icon.url			= icon;
			$scope.iMap.markers.places[ $scope.type ][ $scope.markerSelectedTmpKey ].icon.scaledSize 	= new google.maps.Size( 32 * $rootScope.pixelRatio, 36.35 * $rootScope.pixelRatio );
			$scope.iMap.markers.places[ $scope.type ][ $scope.markerSelectedTmpKey ].icon.anchor 		= new google.maps.Point( 16 * $rootScope.pixelRatio, 13.63125 * $rootScope.pixelRatio );
		}

		if( key !== false && key != -1 ) {
			var displayPlaces 	= localStorageService.get( 'displayPlaces' + $scope.type );
			var findItem = _.findIndex( $scope.iMap.markers.places[ $scope.type ], { 'id': displayPlaces[ key ].id } );
			
			if( $scope.iMap.markers.places[ $scope.type ][ findItem ] ) {
				var icon = $scope.iMap.markers.places[ $scope.type ][ findItem ].icon.url;
				//icon = icon.replace( '.svg', '_selected.svg' );
				icon = icon.replace( '.png', '_selected.png' );
				$scope.iMap.markers.places[ $scope.type ][ findItem ].icon.url			= icon;
				$scope.iMap.markers.places[ $scope.type ][ findItem ].icon.scaledSize 	= new google.maps.Size( 32 * $rootScope.pixelRatio, 36.35 * $rootScope.pixelRatio );
				$scope.iMap.markers.places[ $scope.type ][ findItem ].icon.anchor 		= new google.maps.Point( 16 * $rootScope.pixelRatio, 36.35 * $rootScope.pixelRatio );
				$scope.markerSelectedTmpKey 											= findItem;
			}
		} else {
			$scope.markerSelectedTmpKey = false;
		}
	}
	
	// Close big footer
	var mapClosePoiSlider = function() {
		changeSizeMarker( false );
		$timeout( function() {
			$scope.isMarkerSelected = false;
		}, 0);
	}
	
	// Watch GPS
	var watchPosition = function( force ) {
		if( navigator.geolocation ) {
			var options = { maximumAge: 10000, timeout: 10000, enableHighAccuracy: false };
			var ignoreCenter = ( force ) ? false : localStorageService.get( 'isFirstInitMap' );
			$scope.intWatchPosition = navigator.geolocation.watchPosition( function( pos ) {
				$timeout( function() {
					$scope.gpsIsActive = true;
				}, 0);
            
                if( !ignoreCenter )
                    localStorageService.set( 'isFirstInitMap', true );
        
				changeCenterMap( pos.coords.latitude, pos.coords.longitude, ignoreCenter, false );
				ignoreCenter = true;
			}, function( err ) {
                clearWatchPosition();
        
				switch(err.code)
				{
					case 1:
						globalFunctionService.notificationAlert( "Vous ne partagez pas votre position", false, 'Erreur de localisation', 'OK'  );
						break;
					case 2:
						try {
							if( typeof cordova.plugins.settings.openSetting != undefined && navigator.notification ) {
								navigator.notification.confirm("Veuillez activer la localisation pour l'application TUP.", function( buttonIndex ) {
									switch( buttonIndex ) {
										case 1:
											cordova.plugins.settings.openSetting( 'manage_applications' );
											break;
										default:
											break;
									}
								}, 'Localisation', [ 'Activer', 'Fermer' ]);
							}
						} 
						catch( e ) { 
							console.log( 'Il vous manque le module openSetting ou vous êtes sur un navigateur' ); 
						}
						break;
					default:
						try {
							if( typeof cordova.plugins.settings.openSetting != undefined && navigator.notification ) {
								navigator.notification.confirm("Nous n'arrivons pas à détecter votre position. Veuillez activer la localisation.", function( buttonIndex ) {
									switch( buttonIndex ) {
										case 1:
											cordova.plugins.settings.openSetting( 'location_source' );
											break;
										default:
											break;
									}
								}, 'Localisation', [ 'Activer', 'Fermer' ]);
							}
						} 
						catch( e ) { 
							console.log( 'Il vous manque le module openSetting ou vous êtes sur un navigateur' ); 
						}
						break;
				}
			}, options );
		} else {
			globalFunctionService.notificationAlert( "Vous n'avez pas le service de géolocalisation", false, 'Erreur', 'OK'  );
			clearWatchPosition();
			
		}
	}
	// Stop Watching GPS
	var clearWatchPosition = function() {
		if( $scope.intWatchPosition ) {
			$timeout( function() {
				$scope.gpsIsActive = false;
			}, 0);

			navigator.geolocation.clearWatch( $scope.intWatchPosition );
			$scope.intWatchPosition	= false;
		}
	}
	
	var setUserPosition = function() {
		$scope.iMap.markers.position[0].latitude	= localStorageService.get( 'myLat' );
		$scope.iMap.markers.position[0].longitude	= localStorageService.get( 'myLng' );
	}
	
	// Wait for load API - First function of page
	uiGmapGoogleMapApi.then( function( maps ) {
		// Enable geocoder
		geocoder = new google.maps.Geocoder();
		
		// If actual map is on cache, load it
		// if( myMap ) {
		// 	$scope.iMap.objects[ $scope.type ] = myMap;
			
        if(localStorageService.get( 'myLat2' ) && localStorageService.get( 'myLng2' )){
            $scope.iMap.objects[ $scope.type ] = {
				center: { // Paris
					latitude	: localStorageService.get( 'myLat2' ),
					longitude	: localStorageService.get( 'myLng2' )
				},
				zoom: 14,
				bounds: {}
			};
		// Else created one with default value
		} else {
			$scope.iMap.objects[ $scope.type ] = {
				center: { // Paris
					latitude	: 48.856614,
					longitude	: 2.352222
				},
				zoom: 14,
				bounds: {}
			};
		}
		
		// Set markers
		$scope.iMap.markers = {
			// User position
			position : [{
				id			: 0,
				latitude	: localStorageService.get( 'myLat' ),
				longitude	: localStorageService.get( 'myLng' ),
				title		: 'myPosition',
				optimized	: false,
				icon		: {
					//url			: 'img/map/svg_normal/localisation.svg',
					url			: 'img/map/svg_normal/localisation.png',
					scaledSize	: new google.maps.Size( 24 * $rootScope.pixelRatio, 27.2625 * $rootScope.pixelRatio ),
					origin		: new google.maps.Point( 0, 0 ),
					anchor		: new google.maps.Point( 12 * $rootScope.pixelRatio, 13.63125 * $rootScope.pixelRatio )
				},
				options		: {
					zIndex		: google.maps.Marker.MAX_ZINDEX + 1
				}
			}],
			
			// Display places
			places: {},
			displayPlaces: {},
			events:{
				click: function( e, eventname, marker ) {
					var key = globalFunctionService.getPlaceFromId( marker.id, $scope.type, 'key' );
					changeSizeMarker( key );
					$scope.isMarkerSelected = true;
					$scope.mySlideBox.slide( key );
				}
			} 
		}
		$scope.iMap.markers.places[ $scope.type ] = $scope.iMap.markers.displayPlaces[ $scope.type ] = [];
		
		// Ask for GPS
		watchPosition();
		
		// POI was loaded by 'idle' events of map
		isMapLoadInterval = $interval( function() {
			if( !checkMapBeforeGetPlaces() ) {
				if( $scope.isGood == 5 ) {
					$rootScope.closeLoading();
					globalFunctionService.notificationAlert( "Une erreur serveur est apparue. Il se peut que tous les POI ne s'affichent pas correctement.", false, 'Erreur de chargement', 'OK'  );
				}
			} else {
				$interval.cancel( isMapLoadInterval );
				isMapLoadInterval = false;
				getPlaces();
				
				isMapLoad = true;
			}
			$scope.isGood += 1;
		}, 500, 5, false );
    });
	
	if( typeof analytics !== 'undefined' ) {
		if( $scope.type =='preservatif' )
			analytics.trackView( 'Trouver un préservatif - MAP' );
		else
			analytics.trackView( 'Trouver un lieu de dépistage - MAP' );
	}
});