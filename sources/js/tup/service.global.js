tupModule.service('globalFunctionService', function( localStorageService ) {
	this.getBaseWsUrl = function() {
		//return 'http://tup-testing.sooyoos.com/api/';
        return 'http://tupdata.fr/api/';
	};
	
	this.getPlaceFromId = function( id, type, needVal ) {
		try {
			var displayPlaces 	= localStorageService.get( 'displayPlaces' + type );
			var returnItem 		= false;

			var findItem = _.findIndex( displayPlaces, { 'id': parseInt( id ) } );
			if( needVal == 'key' )
				returnItem = findItem;
			else
				returnItem = displayPlaces[ findItem ];

			return returnItem;
		} catch( e ) { console.log(e); }
	};
	
	this.notificationAlert = function( msg, dismissed, title, btn ) {
		if( navigator.notification ) {
			navigator.notification.alert(
				msg,
				dismissed,
				title,
				btn
			);
		} else {
			alert( msg );
		}
	};
    
    this.transformHorairesPoi = function( obj ) {
		var objReturn 	= [];
		var beginKey 	= false;
		
		var getTitle = function( obj ) {
			if( ( !obj.horaire1 || obj.horaire1 =='' ) || ( !obj.horaire2 || obj.horaire2 == '' ) )
				return false;
			
			return ( obj.ferme != '0' ) ? 'Fermé' : ( obj.horaire1 + ' - ' + obj.horaire2 + ( ( obj.horaire3 && obj.horaire4 ) ? ' / ' + obj.horaire3 + ' - ' + obj.horaire4 : ''  ) );
		}
		
		obj.forEach( function( item, key ) {
			var titleItem = getTitle( item );
			if( titleItem ) {
				if( obj[ key + 1 ] ) {
					if( item.horaire1 == obj[ key + 1 ].horaire1 && item.horaire2 == obj[ key + 1 ].horaire2 ) {
						if( beginKey === false )
							beginKey = key;
					} else {
						if( beginKey === false ) {
							objReturn.push( _.capitalize( item.jour ) + ' : ' + getTitle( item ) );
						} else {
							objReturn.push( 'Du ' + _.capitalize( obj[ beginKey ].jour ) + ' au ' + _.capitalize( item.jour ) + ' : ' + getTitle( item ) );
							beginKey = false;
						}
					}
				} else {
					if( beginKey === false ) {
						objReturn.push( _.capitalize( item.jour ) + ' : ' + getTitle( item ) );
					} else {
						objReturn.push( 'Du ' + _.capitalize( obj[ beginKey ].jour ) + ' au ' + _.capitalize( item.jour ) + ' : ' + getTitle( item ) );
					}
				}
			}
		});

		return ( objReturn.length != 0 ) ? objReturn : false;
	}
    
	this.transformHorairesPoiDepistage = function( obj ) {
        /*******ON SCREEN => *******/
        
        /*
        - CATEGORIE (DEPISTAGE VIH)
            - RDV / No RDV
                - HoraireList
         */
        function HoraireList(_isRDV) {
            this.isRDV = _isRDV;
            this.title = this.isRDV ? '<div class="margin-top">Sans RDV :</div>' : 'Sur RDV anonyme :';
            this.displayHoraires = [];
        }
        
        function Categorie(typeDepistage) {
            this.typeCategorie = typeDepistage;
            this.horairesRDV = new HoraireList(true);
            this.horairesNoRDV = new HoraireList(false);
            
            this.Display = function() {
                
                var displayContent = [];
                
                displayContent.push('<b>' + this.typeCategorie + '</b><br />');
                
                //displayContent.push(this.horairesRDV.title);
                var first=true;
                this.horairesRDV.displayHoraires.forEach(function(element) {
                    if(first){
                        displayContent.push(this.horairesRDV.title);
                    
                    if(this.info_avec_rendez_vous)    
                        displayContent.push("<div class=\"margin\">"+this.info_avec_rendez_vous + "</div>");
                        first=false; 
                    }
                     displayContent.push(element);
                }, this);
                first=true;
                //displayContent.push(this.horairesNoRDV.title);
                this.horairesNoRDV.displayHoraires.forEach(function(element) {
                    if(first){
                        displayContent.push(this.horairesNoRDV.title);
                        
                        if(this.info_sans_rendez_vous)
                            displayContent.push("<div class=\"margin\">"+this.info_sans_rendez_vous + "</div>");
                        
                        first=false;
                    }
                     displayContent.push(element);
                }, this);
                
                return displayContent;
            }
            
            this.getHoraireRDVText = function ( obj ) {               
                var data = [];
                var hasHoraire_rdv_matin = !(obj.horaire_rdv1 == undefined || obj.horaire_rdv1 =='')  && !(obj.horaire_rdv2 == undefined || obj.horaire_rdv2 =='');
                var hasHoraire_rdv_aprem = !(obj.horaire_rdv3 == undefined || obj.horaire_rdv3 =='') && !(obj.horaire_rdv4 == undefined || obj.horaire_rdv4 ==''); 
                
                var hasHoraire_all_day = !(obj.horaire_rdv1 == undefined || obj.horaire_rdv1 =='') && !(obj.horaire_rdv4 == undefined || obj.horaire_rdv4 =='');
                
                
                
                if(!hasHoraire_rdv_matin && !hasHoraire_rdv_aprem && !hasHoraire_all_day)
                    return false;
                
                if(hasHoraire_rdv_matin || hasHoraire_rdv_aprem || hasHoraire_all_day) {
                    if(hasHoraire_rdv_matin) {
                        data.push( obj.horaire_rdv1 + ' - ' + obj.horaire_rdv2 + ( ( obj.horaire_rdv3 && obj.horaire_rdv4 ) ? ' / ' + obj.horaire_rdv3 + ' - ' + obj.horaire_rdv4 : ''  ) ) ;
                    }
                    else if(hasHoraire_all_day) {
                        data.push( obj.horaire_rdv1 + ' - ' + obj.horaire_rdv4) ;
                    }
                    else {
                        data.push( obj.horaire_rdv3 + ' - ' + obj.horaire_rdv4  );
                    }
                    
                }
                return data;
            }
            this.getHoraireNoRDVText = function ( obj ) {               
                var data = [];
                var hasHoraire_sans_rdv_matin = !(obj.horaire1 == undefined || obj.horaire1 =='') && !(obj.horaire2 == undefined || obj.horaire2 =='');
                var hasHoraire_sans_rdv_aprem = !(obj.horaire3 == undefined || obj.horaire3 =='') && !(obj.horaire4 == undefined || obj.horaire4 ==''); 
                var hasHoraire_sans_rdv_all_day = !(obj.horaire1 == undefined || obj.horaire1 =='') && !(obj.horaire4 == undefined || obj.horaire4 =='');
                
                if(!hasHoraire_sans_rdv_matin && !hasHoraire_sans_rdv_aprem && !hasHoraire_sans_rdv_all_day )
                    return;
                
                if(hasHoraire_sans_rdv_matin || hasHoraire_sans_rdv_aprem || hasHoraire_sans_rdv_all_day) {
                    if(hasHoraire_sans_rdv_matin) {
                        data.push(obj.horaire1 + ' - ' + obj.horaire2 + ( ( obj.horaire3 && obj.horaire4 ) ? ' / ' + obj.horaire3 + ' - ' + obj.horaire4 : '' ));
                    }
                    else if(hasHoraire_sans_rdv_all_day) {
                        data.push( obj.horaire1 + ' - ' + obj.horaire4) ;
                    }
                    else {
                        data.push( obj.horaire3 + ' - ' + obj.horaire4  );
                    }
                }
                return data;
            } 
        }
        
        /*** MAIN PROGRAM ***/
        var categories = [];
        var beginKey = false;
        var beginKey2 = false;
        var firstCategorie = true;
        obj.forEach( function( item, key ) {
            beginKey = false;
            beginKey2 = false;
            var currentCategorie = new Categorie(item.type);
            if(item.info_avec_rendez_vous)
                currentCategorie.info_avec_rendez_vous = item.info_avec_rendez_vous
            if(item.info_sans_rendez_vous)
                currentCategorie.info_sans_rendez_vous = item.info_sans_rendez_vous
            item.horaire.forEach(function(horaire, subKey) {                
                if(!horaire.ferme) {
                        if( item.horaire[ subKey + 1 ] ) {
                            
                            if( item.horaire[ subKey ].horaire_rdv1 == item.horaire[ subKey + 1 ].horaire_rdv1 && 
                                item.horaire[ subKey ].horaire_rdv2 == item.horaire[ subKey + 1 ].horaire_rdv2 && 
                                item.horaire[ subKey ].horaire_rdv3 == item.horaire[ subKey + 1 ].horaire_rdv3 && 
                                item.horaire[ subKey ].horaire_rdv4 == item.horaire[ subKey + 1 ].horaire_rdv4 
                                ) {
                                if( beginKey === false )
                                    beginKey = subKey;
                            } 
                            else {
                                var horairesTxt = currentCategorie.getHoraireRDVText( horaire );
                                if( beginKey === false ) {                                    
                                    if(horairesTxt != false && horairesTxt != undefined)
                                        currentCategorie.horairesRDV.displayHoraires.push(_.capitalize( item.horaire[ subKey ].jour ) + ' : ' + horairesTxt);
                                } 
                                else {
                                    if(horairesTxt != false && horairesTxt != undefined)
                                        currentCategorie.horairesRDV.displayHoraires.push('Du ' + _.capitalize( item.horaire[ beginKey ].jour ) + ' au ' + _.capitalize( item.horaire[ subKey ].jour ) + ' : ' + horairesTxt);
                                    beginKey = false;
                                }
                            }
                            
                            if(  item.horaire[ subKey ].horaire1 == item.horaire[ key + 1 ].horaire1 && 
                                 item.horaire[ subKey ].horaire2 == item.horaire[ key + 1 ].horaire2 && 
                                 item.horaire[ subKey ].horaire3 == item.horaire[ key + 1 ].horaire3 && 
                                 item.horaire[ subKey ].horaire4 == item.horaire[ key + 1 ].horaire4
                                ) {
                                if( beginKey2 === false )
                                    beginKey2 = subKey;
                            } 
                            else {
                                var horairesTxt2 = currentCategorie.getHoraireNoRDVText( horaire );
                                if( beginKey2 === false ) {    
                                    if(horairesTxt2 != false && horairesTxt2 != undefined)                                  
                                        currentCategorie.horairesNoRDV.displayHoraires.push(_.capitalize( item.horaire[ subKey ].jour ) + ' : ' + horairesTxt2);
                                }
                                else {  
                                    if(horairesTxt2 != false && horairesTxt2 != undefined)
                                        currentCategorie.horairesNoRDV.displayHoraires.push('Du ' + _.capitalize( item.horaire[ beginKey2 ].jour ) + ' au ' + _.capitalize( item.horaire[ subKey ].jour ) + ' : ' + horairesTxt2);
                                    beginKey2 = false;
                                }
                            }
                        } 
                        else {
                            
                                var horairesTxt = currentCategorie.getHoraireRDVText( horaire );
                                var horairesTxt2 = currentCategorie.getHoraireNoRDVText( horaire );
                                
                            if( beginKey === false ) {
                                if(horairesTxt != false && horairesTxt != undefined)
                                    currentCategorie.horairesRDV.displayHoraires.push(_.capitalize( item.horaire[ subKey ].jour ) + ' : ' +horairesTxt);
                            } 
                            else {
                                if(horairesTxt != false && horairesTxt != undefined)
                                    currentCategorie.horairesRDV.displayHoraires.push('Du ' + _.capitalize( item.horaire[ beginKey ].jour ) + ' au ' + _.capitalize( item.horaire[ subKey ].jour ) + ' : ' + horairesTxt);
                            }
                            if( beginKey2 === false ) {
                                if(horairesTxt2 != false && horairesTxt2 != undefined)
                                    currentCategorie.horairesNoRDV.displayHoraires.push(_.capitalize( item.horaire[ subKey ].jour ) + ' : ' + horairesTxt2);
                            } 
                            else {
                                if(horairesTxt2 != false && horairesTxt2 != undefined)
                                    currentCategorie.horairesNoRDV.displayHoraires.push('Du ' + _.capitalize( item.horaire[ beginKey2 ].jour ) + ' au ' + _.capitalize( item.horaire[ subKey ].jour ) + ' : ' + horairesTxt2);
                            }
                        } 
                }
            }, this);
            
            currentCategorie.Display().forEach(function(element) {
                categories.push(element);
            }, this);
            categories.push('<br/>');
        });
        
        return categories;
	}
});