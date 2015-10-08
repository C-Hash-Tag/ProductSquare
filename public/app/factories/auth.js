angular.module('myApp.auth', [])
.factory('auth', ['data', '$rootScope', function(data, $rootScope){
  var factory = {};
  var Ref = new Firebase('https://productsquare.firebaseio.com/');

  factory.loginUser = function(email, password, cb){
    Ref.authWithPassword({
      email: email,
      password: password
    }, function(error, authData) {
      cb(error, authData, email);
    });
   };

  factory.logout = function(){
    delete localStorage.userID;
    delete localStorage.email;
    Ref.unauth();
    $rootScope.$broadcast('userLoggedOut');
  };

  factory.newUser = function(realName, email, password, cb){
    Ref.createUser({
      email: email,
      password: password
    }, function(error, userData) {
      cb(error, userData);
    });
  };

  return factory;
}]);
