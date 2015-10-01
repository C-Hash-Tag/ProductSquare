angular.module("myApp").directive("navBar", ['$window', "data", function($window, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      scope.submission = false;
      //put the newuserSubmit function here.
      scope.newUserSubmit = function(username, realName, email, password) {
        data.createUser(email, password, username, realName);
        scope.submission = true;
      };
      scope.close = function() {
        scope.submission = false;
      };
    }
  };
}]);


