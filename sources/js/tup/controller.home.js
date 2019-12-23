tupModule.controller( 'homeContoller', function( $scope,$ionicPopup,$rootScope, localStorageService, $ionicSlideBoxDelegate, eventsEnAvantFactory, $timeout ) {
	$scope.mySlideBoxHome = $ionicSlideBoxDelegate.$getByHandle( 'homepage' );
	$scope.tailleFooter="200px";
	// Load event from previous call (from SplashScreen)
	$scope.events_en_avant = localStorageService.get( 'events_en_avant' );
	if($rootScope.isCookie){
		$scope.tailleFooter="75px";
	}
	// If no cache, load items
	if( !$scope.events_en_avant ) {
		eventsEnAvantFactory.getEventsAvant().then( function( response ) {
			$scope.events_en_avant = response;
			$timeout( function() {
				$scope.mySlideBoxHome.update();
				$timeout( function() {
					$scope.mySlideBoxHome.enableSlide(0);
				}, 50);
			}, 10);
		});
	}
	
$scope.cookieOk = function(){
	localStorageService.set("isCookie",true)
$rootScope.isCookie=localStorageService.get("isCookie");
var alertPopup = $ionicPopup.alert({
     title: 'Paramétrage des cookies',
     template: 'Votre choix a été validé'
   });

   alertPopup.then(function(res) {
     $scope.tailleFooter="75px";
		eventsEnAvantFactory.getEventsAvant().then( function( response ) {
			$scope.events_en_avant = response;
			$timeout( function() {
				$scope.mySlideBoxHome.update();
				$timeout( function() {
					$scope.mySlideBoxHome.enableSlide(0);
				}, 50);
			}, 10);
		});
	});
}
$scope.cookieKo = function(){
localStorageService.set("isCookie",false)
$rootScope.isCookie=localStorageService.get("isCookie");
var alertPopup = $ionicPopup.alert({
     title: 'Paramétrage des cookies',
     template: 'Votre choix a été validé'
   });

   alertPopup.then(function(res) {
     
   });
}

	$scope.slideHasChanged = function( index ) {
		if( typeof $scope.events_en_avant[ index ] !== 'undefined' )
			$rootScope.gaTrackEvent( 'home', 'notification', 'view', $scope.events_en_avant[ index ].id )
	}
	
	if( typeof analytics !== 'undefined' )
		analytics.trackView( 'Home' );
});