angular.module("myApp").directive("navBar", ['$window', "data", function($window, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      console.log("TESTTT" + elem);
      //put the newuser function here.
      scope.newUser = function(username, realName, email, password) {
        data.createUser(email, password, username, realName);
        scope.username = "";
        scope.realName = "";
        scope.email = "";
        scope.password = "";

      };

    }
  };
}]);


