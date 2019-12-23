___ PREREQUISITES

NodeJS 	: https://nodejs.org
Cordova : npm install -g cordova
Ionic 	: npm install -g ionic

___ HOW I'VE INSTALLED

ionic start --sass -a "TUP" -i tup.mobile.cordova Git_Tup blank
cd Git_Tup
ionic setup sass

# Use native UI dialog
ionic plugin add cordova-plugin-dialogs

# Use geolocation
ionic plugin add cordova-plugin-geolocation

# Launch external app for navigation
ionic plugin add uk.co.workingedge.phonegap.plugin.launchnavigator

ionic platform add android ios

___ USE

Recompile scss 			: gulp
Recompile scss on line	: gulp watch
Launch virtual browser 	: ionic serve (auto launch gulp watch)

Build app (like cordova): ionic build android ios
Emulate app (like c.)	: ionic emulate android ios 