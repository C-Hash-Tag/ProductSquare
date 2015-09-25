angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.data',
  'myApp.ideaMain',
  'myApp.UserMain'
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
    .when('/user/', {
      templateUrl: './app/userMain/userMain.html',
      controller: 'UserMainCtrl',
      controllerAs: 'vm'
    })

  // $httpProvider
  // do something
}])

// .factory()
