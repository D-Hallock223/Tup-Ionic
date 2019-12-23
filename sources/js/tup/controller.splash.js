tupModule.controller( 'splashContoller', function( eventsEnAvantFactory ) {
	// Load eventEnAvant before Home view
	eventsEnAvantFactory.getEventsAvant().then( function( response ) {
		;
	});
});