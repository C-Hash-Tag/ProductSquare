angular.module('myApp.firebase', [])
.factory('firebase', [function(){
  var Ref = new Firebase('https://productsquare.firebaseio.com/');
  return Ref;
}]);