angular.module("myApp").directive("navBar", ['$window', "data", function($window, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      scope.submission = false;
      scope.loggedIn = false;
      //put the newuserSubmit function here.
      scope.newUserSubmit = function(username, realName, email, password) {
        data.createUser(email, password, username, realName);
        scope.submission = true;
        // scope.realName = '';
      };
      scope.close = function() {
        scope.submission = false;
      };
      scope.login = function(email, password) {
        data.login(email, password);
        scope.loggedIn = true;
      };
      scope.logout = function() {
        console.log("LOGOUT");
        scope.loggedIn = false;
      };
    }
  };
}]);


