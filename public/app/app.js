angular.module('myApp', [
  'ngRoute',
  'myApp.data',
  'myApp.projectMain',
  'myApp.imageUpload',
  'myApp.main',
  'myApp.ideaMain',
  'myApp.UserMain',
  'myApp.auth',
  'myApp.navBar'                                                                                                                                                                                                                                                                                

//montiors stores top-level data for all of the pages on the entire app. 
.controller('AppController', ['$scope', 'data', 'auth', '$route', function($scope, data, auth, $route) {
  console.log("in the app controller!");
}])

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
      css: './app/ideaMain/ideaMain.css',
      activetab:'ideas'
    })
    .when('/user/:userID/', {
      templateUrl: './app/userMain/userMain.html',
      controller: 'UserMainCtrl',
      controllerAs: 'vm',
      activetab: 'myprofile'
    })
    .when('/projects', {
      templateUrl: './app/projectMain/projectMain.html',
      controller:'ProjectMainCtrl',
      controllerAs: 'vm',
      activetab: 'projects'
    });

}])