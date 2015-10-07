angular.module('myApp.auth', [])
.factory('auth', ['data', function(data){
  var factory = {};
  var Ref = new Firebase('https://productsquare.firebaseio.com/');

  factory.authLogin = function(scope){
    Ref.onAuth(function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        scope.loggedIn = true;
        scope.target = "#modalID";
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
        scope.loginUser = true;
        scope.loginError = "Sorry! The email/password is incorrect, please try again."
        scope.$apply();
      } else {
        $('#loginModal').modal('hide');
        scope.email = "";
        scope.password = "";
        scope.loginUser = false;
        scope.$apply();
        console.log("Authenticated successfully with payload:", authData);
        factory.authLogin(scope);
        localStorage.userID = authData.uid;
        localStorage.email = email;
      }
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
        scope.createNewUser = true;
        switch (error.code) {
          case "EMAIL_TAKEN":
            scope.error = "The new user account cannot be created because the email is already in use.";
            break;
          case "INVALID_EMAIL":
            scope.error = "The specified email is not a valid email.";
            break;
          default:
            scope.error = "Error creating user:" + error;
        }
        scope.$apply();
      } else {
        scope.submission = true;
        scope.realName = "";
        scope.email = "";
        scope.password = "";
        scope.$apply()
        console.log("Successfully created user account with uid:", userData.uid);
        data.createUser(email, password, userData.uid, realName);
        factory.authWithPass(email, password, scope);
      }
    });
  };

  return factory;
}]);
