angular.module('myApp.auth', [])
.factory('auth', [function(){
  var factory = {};
  var Ref = new Firebase('https://productsquare.firebaseio.com/');

  factory.authLogin = function(scope){
    Ref.onAuth(function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        scope.loggedIn = true;
      } else {
        console.log("User is logged out");
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
      }
    }, {
      remember: "sessionOnly"
    });
   };

  factory.logout = function(){
    Ref.unauth();
  };

  return factory;
}]);