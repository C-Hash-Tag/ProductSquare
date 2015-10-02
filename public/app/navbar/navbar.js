angular.module("myApp").directive("navBar", ['$window', "auth", "data", function($window, auth, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      var Ref = new Firebase('https://productsquare.firebaseio.com/');
      auth.authLogin(scope);

      //put the newuserSubmit function here.
      scope.newUserSubmit = function(username, realName, email, password) {
        Ref.createUser({
          email: email,
          password: password
        }, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error);
          } else {
            scope.submission = true;
            scope.$apply()
            console.log("Successfully created user account with uid:", userData.uid);
            data.createUser(email, password, username, realName);
            auth.authWithPass(email, password, scope);
          }
        });
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


