angular.module('myApp', [
  'ngRoute',
  'myApp.data',
  'myApp.imageUpload',
  'myApp.main',
  'myApp.ideaMain',
  'myApp.UserMain',
  'myApp.projectMain',
  'myApp.auth'
])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
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
    .when('/projects', {
      templateUrl: './app/projectMain/projectMain.html',
      controller:'ProjectMainCtrl',
      controllerAs: 'vm'
    })

  // $httpProvider
  // do something
}])
.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
})

// .factory()
