angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.data'
  'myApp.ideaMain',
  ])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
  // do something
    .when('/', {
      templateUrl: './app/main/main.html',
      controller: 'MainCtrl',
      controllerAs: 'vm'
    })
    .when('/ideas', {
      templateUrl: './app/ideaMain/ideaMain.html',
      controller: 'IdeaMainCtrl',
      controllerAs: 'vm'
    })

  // $httpProvider
  // do something
}])

// .factory()
