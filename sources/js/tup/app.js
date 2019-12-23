var tupModule = angular.module('tup', [ 'ionic','LocalStorageModule', 'ngLocale', 'uiGmapgoogle-maps', 'slugifier', 'ngIOS9UIWebViewPatch' ]);

tupModule.run( function( $ionicPlatform, $timeout, $ionicHistory, $state, localStorageService ) {
	imageObj 	= new Image();
	images 		= new Array();
	images[0] 	= './img/splashscreen/TUP_SPLASHscreen5.jpg';
	images[1]	= './img/splashscreen/nuage1.png';
	images[2]	= './img/splashscreen/nuage2.png';
	images[3]	= './img/splashscreen/splash_footer.png';
	images[4]	= './img/splashscreen/main1.svg';
	images[5]	= './img/splashscreen/main2.svg';
	images[6]	= './img/splashscreen/main3.svg';
	images[7]	= './img/splashscreen/main4.svg';
	images[8]	= './img/splashscreen/main5.svg';
	images[9]	= './img/splashscreen/main6.svg';
	images[10]	= './img/splashscreen/TUP_title.svg';
	
	for( var i = 0; i < images.length; i++ ) 
	 {
		  imageObj.src=images[i];
	 }
	 
	$ionicPlatform.ready(function() {
		// Remove depreciate cache
		localStorageService.remove( 'displayPlacespreservatif', 'displayPlacesdepistage', 'placespreservatif', 'placesdepistage', 'newPoi', 'addrCache', 'events' );
		
		if( typeof analytics !== 'undefined' ){
			analytics.startTrackerWithId( 'UA-69205332-1' );
			analytics.trackView( 'Splashscreen' );
		} else
			console.log("Google Analytics plugin could not be loaded.");

		// Hide animate splash and show home
		if( ionic.Platform.isAndroid() ) {
			$timeout( function() {
				if( navigator.splashscreen )
					navigator.splashscreen.hide();
				
			}, 2000).then( function() {
				$timeout( function() {
					
					$ionicHistory.nextViewOptions({
						disableAnimate: true
					});

					$state.go( 'app.home' );
				}, 4000);
			} );
		} else {
			$timeout( function() {
				if( navigator.splashscreen )
					navigator.splashscreen.hide();
				
			}, 500).then( function() {
				$timeout( function() {
					
					$ionicHistory.nextViewOptions({
						disableAnimate: true
					});

					$state.go( 'app.home' );
				}, 4000);
			} );
		}
	});
});

tupModule.config( function( $stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, localStorageServiceProvider, $ionicConfigProvider) {
	$ionicConfigProvider.views.swipeBackEnabled(false);
	
	$stateProvider
	
	.state('splash', {
		url: '/splash',
		templateUrl: 'templates/splashscreen.html'})
		
	.state('app', {
		abstract: true,
		url: '/app',
		templateUrl: 'templates/main.html'})
		
	.state('app.home', {
		url: '/home',
		templateUrl: 'templates/home.html'})
		
	.state('app.map', {
		url: '/map/:type',
		templateUrl: 'templates/map.html'})
		
	.state('app.map_id', {
		url: '/map/:type/:id',
		templateUrl: 'templates/map.html'})
		
	.state('app.poi', {
		url: '/poi/:id/:type',
		templateUrl: 'templates/detail_poi.html'})
	
	.state( 'app.signal_poi', {
		url: '/signal_poi/:id/:type',
		templateUrl: 'templates/signal_poi.html'})
		
	.state( 'app.signal_poi_confirm', {
		url: '/signal_poi_confirm/:type',
		templateUrl: 'templates/signal_poi_confirm.html'})
		
	.state( 'app.add_poi', {
		url: '/add_poi',
		templateUrl: 'templates/add_poi.html'})
		
	.state( 'app.add_poi_validation', {
		url: '/add_poi_validation',
		templateUrl: 'templates/add_poi_validation.html'})
		
	.state( 'app.add_poi_confirmation', {
		url: '/add_poi_confirmation',
		templateUrl: 'templates/add_poi_confirmation.html'})
		
	.state('app.agenda', {
		url: '/agenda',
		templateUrl: 'templates/agenda.html'})
		
	.state('app.fiches', {
		url: '/fiches',
		templateUrl: 'templates/fiches.html'})
		
	.state('app.fiches_id', {
		url: '/fiches/:id/:cat',
		templateUrl: 'templates/fiches.html'})
		
	.state('app.agenda_id', {
		url: '/agenda/:id',
		templateUrl: 'templates/agenda.html'})
		
		.state('app.apropos', {
		url: '/apropos',
		templateUrl: 'templates/apropos.html'})
		
	.state('app.agir_apres_un_risque', {
		url: '/agir_apres_un_risque',
		templateUrl: 'templates/agir_apres_un_risque.html'});

	// Default routing
	$urlRouterProvider.otherwise('splash');
  
	// GoogleMap
	uiGmapGoogleMapApiProvider.configure({
        key: "AIzaSyD1I39bqn0AM7p6fMcMl0g3k71X6Y6sM64",  
		v: '3', //defaults to latest 3.X anyhow
		libraries: 'weather,geometry,visualization'
	});

	// LocalService
	localStorageServiceProvider.setPrefix('tupObject');

});
