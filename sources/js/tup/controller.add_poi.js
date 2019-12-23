tupModule.controller( 'addPoiContoller', function( $scope, $rootScope, Slug, $ionicScrollDelegate, localStorageService, globalFunctionService, $state, $ionicHistory, $timeout ) {
	localStorageService.remove( 'newPoi' );

	$scope.basedHtml = {
		nbTable 		: new Array( 7 ),
		displayTable 	: 1,
		showTable 		: [ true, false, false, false, false, false, false ],
		daySelected 	: { 
			L 	: 'no',
			M	: 'no',
			Me 	: 'no',
			J	: 'no',
			V 	: 'no',
			S 	: 'no',
			D	: 'no'
		},
		timeValues : [
			{ horaire1 : null, horaire2 : null, horaire3 : null, horaire4 : null },
			{ horaire1 : null, horaire2 : null, horaire3 : null, horaire4 : null },
			{ horaire1 : null, horaire2 : null, horaire3 : null, horaire4 : null },
			{ horaire1 : null, horaire2 : null, horaire3 : null, horaire4 : null },
			{ horaire1 : null, horaire2 : null, horaire3 : null, horaire4 : null },
			{ horaire1 : null, horaire2 : null, horaire3 : null, horaire4 : null },
			{ horaire1 : null, horaire2 : null, horaire3 : null, horaire4 : null }
		]
	};

	var isHideTabs = false;
	$scope.selectDay = function( day, index ) {
		if( $scope.basedHtml.daySelected[ day ] == 'no' )
			$scope.basedHtml.daySelected[ day ] = index;
		else
			$scope.basedHtml.daySelected[ day ] = 'no';
		
		// Display on new tab
		if( $scope.basedHtml.displayTable == ( index + 1 ) && $scope.basedHtml.displayTable != 7 && !$scope.basedHtml.showTable[ index + 1 ] ) {
			$scope.basedHtml.displayTable += 1;
		}
		
		// Hide tab without day btn if all day was selected
		if( $scope.basedHtml.daySelected.L != 'no' && $scope.basedHtml.daySelected.M != 'no' && $scope.basedHtml.daySelected.Me != 'no' && $scope.basedHtml.daySelected.J != 'no' && $scope.basedHtml.daySelected.V != 'no' && $scope.basedHtml.daySelected.S != 'no' && $scope.basedHtml.daySelected.D != 'no' ) {
			var newShowTable = [ false, false, false, false, false, false, false ];
			newShowTable[ $scope.basedHtml.daySelected.L ] = true;
			newShowTable[ $scope.basedHtml.daySelected.M ] = true;
			newShowTable[ $scope.basedHtml.daySelected.Me ] = true;
			newShowTable[ $scope.basedHtml.daySelected.J ] = true;
			newShowTable[ $scope.basedHtml.daySelected.V ] = true;
			newShowTable[ $scope.basedHtml.daySelected.S ] = true;
			newShowTable[ $scope.basedHtml.daySelected.D ] = true;
			
			$scope.basedHtml.showTable = newShowTable;
		} else if( $scope.basedHtml.daySelected.L == 'no' && $scope.basedHtml.daySelected.M == 'no' && $scope.basedHtml.daySelected.Me == 'no' && $scope.basedHtml.daySelected.J == 'no' && $scope.basedHtml.daySelected.V == 'no' && $scope.basedHtml.daySelected.S == 'no' && $scope.basedHtml.daySelected.D == 'no' ) {
			for( var i = 1; i < $scope.basedHtml.displayTable; i++ ) {
				$scope.basedHtml.showTable[ i ] = false;
			}
		}else {
			for( var i = 0; i < $scope.basedHtml.displayTable; i++ ) {
				$scope.basedHtml.showTable[ i ] = true;
			}
		}
		
		$timeout( function() {
			$ionicScrollDelegate.resize();
		}, 0);
	};
	
	var cacheAddr 		= localStorageService.get( 'addrCache' );
	var cacheAdresse1 	= '';
	var cacheCodePostal = '';
	var cacheVille 		= '';
	if( cacheAddr ) {
		cacheAddr 		= cacheAddr.split( '||' );
		cacheAdresse1 	= ( cacheAddr[0] ) ? cacheAddr[0] : '';
		cacheCodePostal = ( cacheAddr[2] ) ? parseInt( cacheAddr[2] ) : '';
		cacheVille 		= ( cacheAddr[1] ) ? cacheAddr[1] : '';
		
		localStorageService.remove( 'addrCache' );
	}
	
	$scope.lieu = {
		nom 		: '',
		type 		: '',
		typeless 	: '',
		adresse1 	: cacheAdresse1,
		adresse2 	: '',
		codePostal 	: cacheCodePostal,
		ville 		: cacheVille,
		telephone 	: '',
		ouvertureAnnee : false,
		ouverturePartieAnnee : false, 
		preservatifFeminin :  false,  
		preservatifGratuit :  false,
		horaires 	: [
			{ jour : 'Lundi', horaire1 : '', horaire2 : '', horaire3 : '', horaire4 : '', ferme : '0' },
			{ jour : 'Mardi', horaire1 : '', horaire2 : '', horaire3 : '', horaire4 : '', ferme : '0' },
			{ jour : 'Mercredi', horaire1 : '', horaire2 : '', horaire3 : '', horaire4 : '', ferme : '0' },
			{ jour : 'Jeudi', horaire1 : '', horaire2 : '', horaire3 : '', horaire4 : '', ferme : '0' },
			{ jour : 'Vendredi', horaire1 : '', horaire2 : '', horaire3 : '', horaire4 : '', ferme : '0' },
			{ jour : 'Samedi', horaire1 : '', horaire2 : '', horaire3 : '', horaire4 : '', ferme : '0' },
			{ jour : 'Dimanche', horaire1 : '', horaire2 : '', horaire3 : '', horaire4 : '', ferme : '0' }
		]
	};

	
	$scope.setType = function( lieu ) {
		$scope.lieu.type 		= lieu;
		$scope.lieu.typeless 	= Slug.slugify( lieu );
		$timeout( function() {
			$ionicScrollDelegate.resize();
		}, 0);
	};
	
	$scope.validLieu = function() {	
		if( !$scope.lieu.type || !$scope.lieu.adresse1 || !$scope.lieu.codePostal || !$scope.lieu.ville )
		{
			$scope.isError = true;
			$rootScope.openLoading('<p class="fw_b">Vous devez renseigner tous les champs obligatoires pour soumettre un nouveau lieu.</p><button class="button button-full button-royal bround_5px" ng-click="closeLoading()" style="margin-top: 25px;">OK</button>');
			
			if( typeof analytics !== 'undefined' )
				analytics.trackView( 'Trouver un préservatif - Ajout - pop alerte' );
		}
		else {
			if( $scope.basedHtml.daySelected.L != 'no' ) {
				var h1 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.L ].horaire1;
				var h2 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.L ].horaire2;
				var h3 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.L ].horaire3;
				var h4 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.L ].horaire4;
				
				if( h1 )
					$scope.lieu.horaires[ 0 ].horaire1 = h1.getHours() + 'h' + (( h1.getMinutes() < 10 ) ? '0' + h1.getMinutes() : h1.getMinutes());
				
				if( h2 )
					$scope.lieu.horaires[ 0 ].horaire2 = h2.getHours() + 'h' + (( h2.getMinutes() < 10 ) ? '0' + h2.getMinutes() : h2.getMinutes());
				
				if( h3 )
					$scope.lieu.horaires[ 0 ].horaire3 = h3.getHours() + 'h' + (( h3.getMinutes() < 10 ) ? '0' + h3.getMinutes() : h3.getMinutes());
				
				if( h4 )
					$scope.lieu.horaires[ 0 ].horaire4 = h4.getHours() + 'h' + (( h4.getMinutes() < 10 ) ? '0' + h4.getMinutes() : h4.getMinutes());
			}
			
			if( $scope.basedHtml.daySelected.M != 'no' ) {
				var h1 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.M ].horaire1;
				var h2 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.M ].horaire2;
				var h3 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.M ].horaire3;
				var h4 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.M ].horaire4;
				
				if( h1 )
					$scope.lieu.horaires[ 1 ].horaire1 = h1.getHours() + 'h' + (( h1.getMinutes() < 10 ) ? '0' + h1.getMinutes() : h1.getMinutes());
				
				if( h2 )
					$scope.lieu.horaires[ 1 ].horaire2 = h2.getHours() + 'h' + (( h2.getMinutes() < 10 ) ? '0' + h2.getMinutes() : h2.getMinutes());
				
				if( h3 )
					$scope.lieu.horaires[ 1 ].horaire3 = h3.getHours() + 'h' + (( h3.getMinutes() < 10 ) ? '0' + h3.getMinutes() : h3.getMinutes());
				
				if( h4 )
					$scope.lieu.horaires[ 1 ].horaire4 = h4.getHours() + 'h' + (( h4.getMinutes() < 10 ) ? '0' + h4.getMinutes() : h4.getMinutes());
			}
			
			if( $scope.basedHtml.daySelected.Me != 'no' ) {
				var h1 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.Me ].horaire1;
				var h2 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.Me ].horaire2;
				var h3 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.Me ].horaire3;
				var h4 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.Me ].horaire4;
				
				if( h1 )
					$scope.lieu.horaires[ 2 ].horaire1 = h1.getHours() + 'h' + (( h1.getMinutes() < 10 ) ? '0' + h1.getMinutes() : h1.getMinutes());
				
				if( h2 )
					$scope.lieu.horaires[ 2 ].horaire2 = h2.getHours() + 'h' + (( h2.getMinutes() < 10 ) ? '0' + h2.getMinutes() : h2.getMinutes());
				
				if( h3 )
					$scope.lieu.horaires[ 2 ].horaire3 = h3.getHours() + 'h' + (( h3.getMinutes() < 10 ) ? '0' + h3.getMinutes() : h3.getMinutes());
				
				if( h4 )
					$scope.lieu.horaires[ 2 ].horaire4 = h4.getHours() + 'h' + (( h4.getMinutes() < 10 ) ? '0' + h4.getMinutes() : h4.getMinutes());
			}
			
			if( $scope.basedHtml.daySelected.J != 'no' ) {
				var h1 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.J ].horaire1;
				var h2 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.J ].horaire2;
				var h3 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.J ].horaire3;
				var h4 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.J ].horaire4;
				
				if( h1 )
					$scope.lieu.horaires[ 3 ].horaire1 = h1.getHours() + 'h' + (( h1.getMinutes() < 10 ) ? '0' + h1.getMinutes() : h1.getMinutes());
				
				if( h2 )
					$scope.lieu.horaires[ 3 ].horaire2 = h2.getHours() + 'h' + (( h2.getMinutes() < 10 ) ? '0' + h2.getMinutes() : h2.getMinutes());
				
				if( h3 )
					$scope.lieu.horaires[ 3 ].horaire3 = h3.getHours() + 'h' + (( h3.getMinutes() < 10 ) ? '0' + h3.getMinutes() : h3.getMinutes());
				
				if( h4 )
					$scope.lieu.horaires[ 3 ].horaire4 = h4.getHours() + 'h' + (( h4.getMinutes() < 10 ) ? '0' + h4.getMinutes() : h4.getMinutes());
			}
			
			if( $scope.basedHtml.daySelected.V != 'no' ) {
				var h1 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.V ].horaire1;
				var h2 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.V ].horaire2;
				var h3 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.V ].horaire3;
				var h4 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.V ].horaire4;
				
				if( h1 )
					$scope.lieu.horaires[ 4 ].horaire1 = h1.getHours() + 'h' + (( h1.getMinutes() < 10 ) ? '0' + h1.getMinutes() : h1.getMinutes());
				
				if( h2 )
					$scope.lieu.horaires[ 4 ].horaire2 = h2.getHours() + 'h' + (( h2.getMinutes() < 10 ) ? '0' + h2.getMinutes() : h2.getMinutes());
				
				if( h3 )
					$scope.lieu.horaires[ 4 ].horaire3 = h3.getHours() + 'h' + (( h3.getMinutes() < 10 ) ? '0' + h3.getMinutes() : h3.getMinutes());
				
				if( h4 )
					$scope.lieu.horaires[ 4 ].horaire4 = h4.getHours() + 'h' + (( h4.getMinutes() < 10 ) ? '0' + h4.getMinutes() : h4.getMinutes());
			}
			
			if( $scope.basedHtml.daySelected.S != 'no' ) {
				var h1 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.S ].horaire1;
				var h2 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.S ].horaire2;
				var h3 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.S ].horaire3;
				var h4 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.S ].horaire4;
				
				if( h1 )
					$scope.lieu.horaires[ 5 ].horaire1 = h1.getHours() + 'h' + (( h1.getMinutes() < 10 ) ? '0' + h1.getMinutes() : h1.getMinutes());
				
				if( h2 )
					$scope.lieu.horaires[ 5 ].horaire2 = h2.getHours() + 'h' + (( h2.getMinutes() < 10 ) ? '0' + h2.getMinutes() : h2.getMinutes());
				
				if( h3 )
					$scope.lieu.horaires[ 5 ].horaire3 = h3.getHours() + 'h' + (( h3.getMinutes() < 10 ) ? '0' + h3.getMinutes() : h3.getMinutes());
				
				if( h4 )
					$scope.lieu.horaires[ 5 ].horaire4 = h4.getHours() + 'h' + (( h4.getMinutes() < 10 ) ? '0' + h4.getMinutes() : h4.getMinutes());
			}
			
			if( $scope.basedHtml.daySelected.D != 'no' ) {
				var h1 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.D ].horaire1;
				var h2 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.D ].horaire2;
				var h3 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.D ].horaire3;
				var h4 = $scope.basedHtml.timeValues[ $scope.basedHtml.daySelected.D ].horaire4;
				
				if( h1 )
					$scope.lieu.horaires[ 6 ].horaire1 = h1.getHours() + 'h' + (( h1.getMinutes() < 10 ) ? '0' + h1.getMinutes() : h1.getMinutes());
				
				if( h2 )
					$scope.lieu.horaires[ 6 ].horaire2 = h2.getHours() + 'h' + (( h2.getMinutes() < 10 ) ? '0' + h2.getMinutes() : h2.getMinutes());
				
				if( h3 )
					$scope.lieu.horaires[ 6 ].horaire3 = h3.getHours() + 'h' + (( h3.getMinutes() < 10 ) ? '0' + h3.getMinutes() : h3.getMinutes());
				
				if( h4 )
					$scope.lieu.horaires[ 6 ].horaire4 = h4.getHours() + 'h' + (( h4.getMinutes() < 10 ) ? '0' + h4.getMinutes() : h4.getMinutes());
			}
			
			localStorageService.set( 'newPoi', $scope.lieu );
			$state.go( 'app.add_poi_validation' );
		}
	};
	
	// Click on back button
	$rootScope.goBackCustom = function() {
		$ionicHistory.goBack();
	};
	
	if( typeof analytics !== 'undefined' )
		analytics.trackView( 'Trouver un préservatif - Ajout' );
});