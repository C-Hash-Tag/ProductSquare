angular.module('myApp.auth', [])
.factory('auth', ['data', '$rootScope', '$location', 'firebase', function(data, $rootScope, $location, firebase){
  var factory = {};

  factory.loginUser = function(email, password, cb){
    firebase.authWithPassword({
      email: email,
      password: password
    }, function(error, authData) {
      cb(error, authData, email);
    });
  };

  factory.logout = function(){
    delete localStorage.userID;
    firebase.unauth();
    $rootScope.$broadcast('userLoggedOut');
    $location.path('/');
  };

  factory.newUser = function(realName, email, password, cb){
    firebase.createUser({
      email: email,
      password: password
    }, function(error, userData) {
      cb(error, userData);
    });
  };

  return factory;
}]);
