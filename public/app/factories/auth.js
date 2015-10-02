angular.module('myApp.auth', [])
.factory('auth', ['data', function(data){
  var factory = {};
  var Ref = new Firebase('https://productsquare.firebaseio.com/');

  factory.authLogin = function(scope){
    Ref.onAuth(function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        scope.loggedIn = true;
        scope.target = "#myModal";
      } else {
        console.log("User is logged out");
        scope.target = "#signUpModal";
      }
    });
  };

  factory.authWithPass = function(email, password, scope){
    Ref.authWithPassword({
      email: email,
      password: password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        scope.loggedIn = true;
        scope.$apply();
        console.log("Authenticated successfully with payload:", authData);
        factory.authLogin(scope);
        localStorage.userID = authData.uid;
        localStorage.email = email;
      }
    }, {
      remember: "sessionOnly"
    });
   };

  factory.logout = function(){
    delete localStorage.userID;
    delete localStorage.email;
    Ref.unauth();
  };

  factory.newUser = function(realName, email, password, scope){
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
          data.createUser(email, password, userData.uid, realName);
          factory.authWithPass(email, password, scope);
        }
      });
  };

  return factory;
}]);