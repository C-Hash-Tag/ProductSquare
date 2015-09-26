angular.module('myApp', [
  'ngRoute',
  'myApp.data',
  'myApp.main',
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
      controllerAs: 'vm',
      css: './app/ideaMain/ideaMain.css'
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
