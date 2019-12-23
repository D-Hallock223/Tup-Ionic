tupModule.controller( 'fichesContoller', function( $scope, $rootScope, $stateParams, fichesFactory, $ionicLoading, $timeout, $ionicHistory, $state, $ionicViewSwitcher ) {
	$ionicLoading.show({
		template: 'Chargement...'
	});
	
	$scope.display 				= 'cat';
	$scope.currentCat 			= false;
	$scope.currentCatIndex 		= false;
	$scope.currentItemIndex 	= false;
	$scope.isOnSlide			= false;
	
	$scope.obj = {
		heightTitle : 20,
		categories : [
			{
				key 		: 'preservatif_masculin_et_feminin',
				tupicon 	: '<i class="tupicon-condomfemme"></i><i class="tupicon-condom"></i>',
				title 		: 'Préservatif féminin et masculin',
				fiches		: []
			},{
				key 		: 'depistage',
				tupicon 	: '<i class="tupicon-plus"></i>',
				title 		: 'Dépistage',
				fiches		: []
			},{
				key 		: 'contraception_et_vaccins',
				tupicon 	: '<i class="tupicon-contraception"></i>',
				title 		: 'Contraception d\'urgence',
				fiches		: []
			},{
				key 		: 'tpe_traitement_post_exposition',
				tupicon 	: '<i class="tupicon-tpe"></i>',
				title 		: 'TPE - Traitement post exposition',
				fiches		: []
			},{
				key 		: 'ist_infections_sexuellement_transmissibles',
				tupicon 	: '<i class="tupicon-ist"></i>',
				title 		: 'IST - Infections sexuellement transmissibles',
				fiches		: []
			},
		]
	};
	
	fichesFactory.getFiches().then( function( response ) {
		$scope.obj.categories[ 0 ].fiches = response[ 'preservatif_masculin_et_feminin' ];
		$scope.obj.categories[ 1 ].fiches = response[ 'depistage' ];
		$scope.obj.categories[ 2 ].fiches = response[ 'contraception_et_vaccins' ];
		$scope.obj.categories[ 3 ].fiches = response[ 'tpe_traitement_post_exposition' ];
		$scope.obj.categories[ 4 ].fiches = response[ 'ist_infections_sexuellement_transmissibles' ];

		if( $stateParams.id && $stateParams.cat ) {
			var fiche_id 	= $stateParams.id;
			var cat_id 		= $stateParams.cat;
			var fiche_key	= false;
			
			$scope.obj.categories[ ( cat_id - 1 ) ].fiches.forEach( function( item, key ) {
				if( item.id == fiche_id )
					fiche_key = key;
			});
			
			if( fiche_key !== false ) {
				$scope.display 			= 'item';
				$scope.currentCatIndex 	= cat_id;
				$scope.currentCat		= $scope.obj.categories[ ( cat_id - 1 ) ].key;
				$scope.currentItemIndex	= fiche_key;
				$scope.isOnSlide		= true;
				$scope.obj.heightTitle 	= 10;
			}
		}
		
		$ionicLoading.hide();
	});
	
	$scope.setCat = function( cat, index ) {
		$scope.isOnSlide 	= false;
		$stateParams.id 	= false;
		if( $scope.display == 'item' ) {
			$scope.display = 'cat';
		}else if( cat == $scope.currentCat ) {
			$scope.currentCat 		= false;
			$scope.currentCatIndex	= false;
			$scope.obj.heightTitle 	= 20;
		} else {
			$scope.currentCat 		= cat;
			$scope.currentCatIndex	= index;
			$scope.obj.heightTitle 	= 10;
		}
	}

	$scope.setItem = function( index, e ) {
		$scope.display 			= 'item';
		$scope.currentItemIndex = index;
		
		$timeout( function() {
			$scope.isOnSlide = true;
		}, 500);
		
		if( typeof analytics !== 'undefined' )
			analytics.trackView( 'Fiches pratiques - ' + $scope.obj.categories[ ( $scope.currentCatIndex - 1 ) ].fiches[ index ].nom );
	};
	
	$scope.onCatSwipe = function( e ) {
		if( e.gesture.direction == 'left' && $scope.currentCatIndex != $scope.obj.categories.length ) {
			$scope.currentItemIndex = 0;
			$scope.currentCatIndex += 1;
			
			$rootScope.gaTrackEvent( 'FP', 'categorie', 'swipe' );
		} else if( e.gesture.direction == 'right' && $scope.currentCatIndex != 1 ) {
			$scope.currentItemIndex = 0;
			$scope.currentCatIndex -= 1;
			
			$rootScope.gaTrackEvent( 'FP', 'categorie', 'swipe' );
		}
	}
	
	$scope.onItemSwipe = function( e ) {
		if( e.gesture.direction == 'left' ) {
			if( ( $scope.currentItemIndex + 1 ) != $scope.obj.categories[ ( $scope.currentCatIndex - 1 ) ].fiches.length ) {
				$scope.currentItemIndex += 1;
				
				$rootScope.gaTrackEvent( 'FP', 'fiche', 'swipe' );
			} else {
				$scope.onCatSwipe( e );
			}
		} else if( e.gesture.direction == 'right' ) {
			if( $scope.currentItemIndex != 0 ) {
				$scope.currentItemIndex -= 1;
				
				$rootScope.gaTrackEvent( 'FP', 'fiche', 'swipe' );
			} else {
				$scope.onCatSwipe( e );
			}
		}
	}
	
	$rootScope.goBackCustom = function() {
		if( $stateParams.id && $scope.display == 'item' && ( $state.current.name == 'app.fiches_id' || $state.current.name == 'app.fiches' ) ) {
			$ionicHistory.goBack();
			$scope.display 			= 'cat';
			$scope.currentCatIndex 	= false;
			$scope.currentCat		= false;
			$scope.currentItemIndex	= false;
			$scope.isOnSlide		= false;
			$scope.obj.heightTitle 	= 20;
		} else if( ( $state.current.name == 'app.fiches_id' || $state.current.name == 'app.fiches' ) && $scope.obj.heightTitle != 20 ) {
			$timeout( function() {
				$scope.setCat( $scope.currentCat );
			}, 0);
		} else {
			$ionicViewSwitcher.nextDirection( 'back' )
			$state.go( 'app.home' );
		}
	};
	
	if( typeof analytics !== 'undefined' )
		analytics.trackView( 'Fiches pratiques - Menu' );
});