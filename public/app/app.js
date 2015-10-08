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
])                                                                                                                                                                                                                                                                             

//montiors stores top-level data for all of the pages on the entire app. 
.controller('AppController', ['$scope', 'data', 'auth', '$route', function($scope, data, auth, $route) {
  //if the localStorage userID is set, retrieve that user using the data.getUser method.

  if (localStorage.userID){
    data.getUser(localStorage.userID, function(user){
      console.log("userLoggedIn", user);
      $scope.loggedIn = true;
      $scope.target = "#submitModalIdea";
      $scope.loggedInUserID = user.userId;
      $scope.loggedInUserRealName = user.realName;
      $scope.loggedInUserProfileImage = user.profileImage;
      $scope.$apply();
      $scope.$broadcast("userFoundInLocal");
    });
  }

  data.getIdeas(function(ideas){
    $scope.newIdeas = ideas;
    $scope.$apply();
  })

  //when the user is retrieved, set these top level scope vars to user properties. This is also triggered by login.
  $scope.$on('userLoggedIn', function(event, user){
    console.log("userLoggedIn", user);
    $scope.loggedIn = true;
    $scope.target = "#submitModalIdea";
    $scope.loggedInUserID = user.userId;
    $scope.loggedInUserRealName = user.realName;
    $scope.loggedInUserProfileImage = user.profileImage;
    $scope.$apply();
    $scope.$broadcast("userNowLoggedIn");
  });

  //when the user logs out, reset these vars for the entire app.
  $scope.$on('userLoggedOut', function(event){
    $scope.loggedIn = false;
    $scope.loggedInUserID = "";
    $scope.loggedInUserRealName = "";
    $scope.loggedInUserProfileImage = "";
    $scope.target = "#signUpModal";
  });

  $scope.$on('userLoggedInUpdated', function(event, userId) {
    data.getUser(userId, function(event, user){
      console.log("userLoggedIn", user);
      $scope.loggedIn = true;
      $scope.loggedInUserID = user.userId;
      $scope.loggedInUserRealName = user.realName;
      $scope.loggedInUserProfileImage = user.profileImage;
      console.log($scope.target);
      //$scope.$apply();
    });
  });

}])

.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './app/main/main.html',
      controller: 'MainCtrl',
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

}]);
