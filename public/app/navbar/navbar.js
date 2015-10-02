angular.module("myApp").directive("navBar", ['$window', "data", function($window, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      var Ref = new Firebase('https://productsquare.firebaseio.com/');
      scope.submission = false;
      scope.loggedIn = false;
      //put the newuserSubmit function here.
      scope.newUserSubmit = function(username, realName, email, password) {
        data.createUser(email, password, username, realName);
        Ref.createUser({
          email: email,
          password: password
        }, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error);
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            Ref.authWithPassword({
              email    : email,
              password : password
            }, function(error, authData) {
              if (error) {
                console.log("Login Failed!", error);
              } else {
                console.log("Authenticated successfully with payload:", authData);
                Ref.onAuth(function authDataCallback(authData) {
                  if (authData) {
                    console.log("User " + authData.uid + " is logged in with " + authData.provider);
                    scope.submission = true;
                    scope.loggedIn = true;
                  } else {
                    Ref.unauth();
                    scope.loggedIn = false;
                    console.log("User is logged out");
                  }
                })
              }
            }, {
              remember: "sessionOnly"
            });
          }
        });
      };
      scope.close = function() {
        scope.submission = false;
      };
      scope.login = function(email, password) {
        scope.loggedIn = true;
        Ref.authWithPassword({
          email    : email,
          password : password
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            Ref.onAuth(function authDataCallback(authData) {
              if (authData) {
                scope.submission = true;
                console.log("User " + authData.uid + " is logged in with " + authData.provider);
              } else {
                Ref.unauth();
                scope.loggedIn = false;
                console.log("User is logged out");
              }
            })
          }
        }, {
          remember: "sessionOnly"
        });
      };
    
      scope.logout = function(){
        Ref.unauth(function(){
          scope.loggedIn = false;
        });
      };
    }
  }
}]);


