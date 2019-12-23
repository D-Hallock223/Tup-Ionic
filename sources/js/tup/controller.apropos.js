tupModule.controller( 'aproposController', function( $rootScope,$scope,localStorageService,$ionicScrollDelegate, $timeout, $location,$state,$ionicPopup ) {
  $scope.show_vie_privee  = false;
  $scope.show_cgu   = false;
   $scope.show_cookie   = false;

  $scope.toggleMyCookie = function(){
   $scope.show_cookie = !$scope.show_cookie;
   $timeout( function() {
    $ionicScrollDelegate.resize();
    if(!$scope.show_cookie) {
     $timeout( function() {
      var handle = $ionicScrollDelegate.$getByHandle('content');
      handle.anchorScroll();
      $ionicScrollDelegate.scrollBottom();
     }, 250);
    }
   }, 250);   
  }

if(self.location.href.indexOf("cookies")>0){
  $scope.toggleMyCookie();
  $timeout( function() {
    $ionicScrollDelegate.resize();
     $timeout( function() {
      $ionicScrollDelegate.scrollBottom();
     }, 250);
  }, 250);   
}

$scope.cookieOk = function(){
  localStorageService.set("isCookie",true)
$rootScope.isCookie=localStorageService.get("isCookie");
var alertPopup = $ionicPopup.alert({
     title: 'Paramétrage des cookies',
     template: 'Votre choix a été validé'
   });

   alertPopup.then(function(res) {
     
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
  $scope.toggleViePrivee = function(){
   $scope.show_vie_privee = !$scope.show_vie_privee;
   $timeout( function() {
    $ionicScrollDelegate.resize();
    if(!$scope.show_vie_privee) {
     $timeout( function() {
      var handle = $ionicScrollDelegate.$getByHandle('content');
      handle.anchorScroll();
      $ionicScrollDelegate.scrollBottom();
     }, 250);
    }
   }, 250);
  }
  
  $scope.toggleCgu = function(){
   $scope.show_cgu = !$scope.show_cgu;
   $timeout( function() {
    $ionicScrollDelegate.resize();
    if(!$scope.show_cgu) {
     $timeout( function() {
      var handle = $ionicScrollDelegate.$getByHandle('content');
      handle.anchorScroll();
      $ionicScrollDelegate.scrollBottom();
     }, 250);
    }
   }, 250);
  }
});