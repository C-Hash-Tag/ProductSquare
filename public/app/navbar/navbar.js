angular.module("myApp").directive("navBar", ['$window', "auth", "data", function($window, auth, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      var Ref = new Firebase('https://productsquare.firebaseio.com/');
      auth.authLogin(scope);
      //put the newuserSubmit function here.
      scope.newUserSubmit = function(realName, email, password) {
        auth.newUser(realName, email, password, scope);
      };


      scope.close = function() {
        scope.submission = false;
      };
      scope.login = function(email, password) {
        auth.authWithPass(email, password, scope);
      };
    
      scope.logout = function(){
        scope.loggedIn = false;
        auth.logout();
      };
    }
  }
}]);


