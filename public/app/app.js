angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.user'
  ])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
  // do something
    .when('/', {
      templateUrl: './app/main/main.html',
      controller: 'MainCtrl',
      controllerAs: 'vm'
    })

  $httpProvider
  // do something
}])

// .factory()
