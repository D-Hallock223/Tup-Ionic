tupModule.controller( 'globalController', function( $rootScope, localStorageService,$ionicSideMenuDelegate, $ionicGesture, $ionicModal, $ionicHistory, $ionicLoading, $state, $ionicPlatform ) {
	// Logo TUP to header
	$rootScope.pageTitle 	= '<img src="./img/navLogo.svg" height="40" width="45" />';
	
	$rootScope.isAndroid	= ionic.Platform.isAndroid();
	$rootScope.isIOS		= ionic.Platform.isIOS();
	$rootScope.isCookie=localStorageService.get("isCookie");
	// Pixel ratio (-1 because interface based on iPhone4 wich have pixel ratio = 2)
	if($rootScope.isAndroid) {
		if( window.devicePixelRatio < 2 ) {
			$rootScope.pixelRatio 	= window.devicePixelRatio;	
		} else {
			$rootScope.pixelRatio	= 1;	
		}
	} else if($rootScope.isIOS) {
		$rootScope.pixelRatio = 1;
	} else {
		$rootScope.pixelRatio 	= window.devicePixelRatio - 1;
	}
	
	if( $rootScope.pixelRatio == 0)
	{
		 $rootScope.pixelRatio = 1.5;
	}
	
	if( ionic.Platform.isIOS() && parseFloat( ionic.Platform.version() ) >= 7.0) {
		//$rootScope.bodyClass = 'borderDropBox';
	}

	// Menu
	$ionicModal.fromTemplateUrl( 'templates/menu.html', function( modal ) {
		// Link Modal to Menu
		modal.modalEl = modal.el.querySelector( '.menu' );
		modal.$el.addClass('sidemenu-modal');

		// Handle swiping the backdrop to close
		var gesture = $ionicGesture.on( 'swipe', $rootScope.onSideMenuSwipe, modal.$el );
		$rootScope.$on( '$destroy', function() {
			$ionicGesture.off( gesture, 'swipe', $rootScope.onSideMenuSwipe );
		});

		// Modify some of the modal's methods
		modal._hide = modal.hide;
		modal._show = modal.show;
		modal.show 	= function() {
			if( typeof analytics !== 'undefined' )
				analytics.trackView( 'Menu' );
			
			document.body.classList.add( 'menu-open' );
			$rootScope.isMenuOpener = true;
			this._show();
		};
		modal.hide = function() {
			this._hide();
			$rootScope.isMenuOpener = false;
			document.body.classList.remove( 'menu-open' );
		};
		modal.toggle = function() {
			if( this.isShown() )
				this.hide();
			else
				this.show();
		};

		$rootScope.sideMenu = modal;
	}, {
		scope: $rootScope
	});
	
	// On swipe on right of App
	$rootScope.onSideMenuSwipe = function( $event ) {
		if( $state.current.name != 'app.fiches' && $state.current.name != 'app.fiches_id' ) {
			if( $event.gesture.direction == 'left' ) {
				var startedFrom = $event.gesture.startEvent.center;
				if( startedFrom.pageX >=  window.innerWidth - ( 30 * $rootScope.pixelRatio ) ) {
					$event.preventDefault();
					$event.stopPropagation();
					$rootScope.sideMenu.show();
					$rootScope.isMenuOpener = true;
				}
			} else if( $event.gesture.direction == 'right' ) {
				if( $rootScope.sideMenu.isShown() ) {
					$rootScope.sideMenu.hide();
					$rootScope.isMenuOpener = false;
				}
			}
		}
	}
	
	// Open link on device browser
	$rootScope.openExternalLink = function( link ) {
		window.open( link , '_system');
	};
	
	// Click on back btn
	$rootScope.goBack = function() {
		if( !$rootScope.goBackCustom )
			$ionicHistory.goBack();
		else
			$rootScope.goBackCustom();
	};
	
	// Open loading
	$rootScope.openLoading = function( template ) {
		if( !template )
			template = 'Chargement...';
		
		$ionicLoading.show({
			template: template
		});
	};
	
	// Close loading
	$rootScope.closeLoading = function() {
		$ionicLoading.hide();
	};
	
	// GA send trackEvent
	$rootScope.gaTrackEvent = function( cat, action, label, value ) {
		if( typeof analytics !== 'undefined' ) {
			if( !label && !value )
				analytics.trackEvent( cat, action );
			else if( label && !value )
				analytics.trackEvent( cat, action, label );
			if( label && value )
				analytics.trackEvent( cat, action, label, value );
		}
	};
	
	// Override Android back button
	$ionicPlatform.registerBackButtonAction( function( e ) {
		if( $state.current.name != 'app.home' ) {
			$rootScope.goBack();
			e.preventDefault();
			return false;
		} else {
			ionic.Platform.exitApp();
		}
	}, 101);
});