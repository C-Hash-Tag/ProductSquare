angular.module('myApp', [
  'ngRoute',
  'myApp.data',
  'myApp.projectMain',
  'myApp.imageUpload',
  'myApp.main',
  'myApp.ideaMain',
  'myApp.UserMain',
  'myApp.OrgMain',
  'myApp.auth',
  'myApp.navBar'
])

//montiors stores top-level data for all of the pages on the entire app.
.controller('AppController', ['$scope', 'data', 'auth', '$route', function($scope, data, auth, $route) {

  $scope.target = "#signUpModal"; //if an organization has not logged in or not signed in, the default is that they will be sent to signUp modal when they want to submit a proposal
  $scope.projTarget = "#signUpModal";

  var updateLoggedInScopes = function(user){
    $scope.loggedIn = true;
    $scope.target = "#submitModalIdea";
    $scope.projTarget = "#submitModalProject";
    $scope.loggedInUserID = user.userId;
    $scope.loggedInUserRealName = user.realName;
    $scope.loggedInUserProfileImage = user.profileImage;
    $scope.loggedInUserCleanUrl = user.cleanUrl; //the url used to create the users profile.
    $scope.userType = user.userType; // organization or student
    if(user.userType === "organization"){
      $scope.isOrg = true;
    }
    if(user.userType === "student"){
      $scope.isStudent = true;
    }
    $scope.$apply();
    console.log("inside app.js ",  $scope.loggedInUserCleanUrl, user.cleanUrl)
  };

  //if the localStorage userID is set, retrieve that user using the data.getUser method
  if (localStorage.userID){
    //get the logged in users ideas.
    data.getLoggedInUsersIdeas(localStorage.userID, function(ideasSubmitted){
      $scope.loggedInUserIdeas = ideasSubmitted
      $scope.$apply();
    });

    //get the signed in users data.
    data.getUser(localStorage.userID, function(user){
      console.log("userLoggedIn", user);
      updateLoggedInScopes(user);
      $scope.$broadcast("userFoundInLocal");
    });
    data.getLoggedInUsersIdeas(localStorage.userID, function(ideasSubmitted){
      $scope.loggedInUserIdeas = ideasSubmitted
      $scope.$apply();
    });
  }

  data.getProjects(function(projects){
    $scope.newProjects = projects;
    $scope.$apply();
  });

  data.getIdeas(function(ideas){
    $scope.newIdeas = ideas;
    $scope.$apply();
  });

  //when the user is retrieved, set these top level scope vars to user properties. This is also triggered by login.
  $scope.$on('userLoggedIn', function(event, user){
    console.log("userLoggedIn", user);
    updateLoggedInScopes(user);
    $scope.$broadcast("userNowLoggedIn");
  });

  //when the user logs out, reset these vars for the entire app.
  $scope.$on('userLoggedOut', function(event){
    $scope.loggedIn = false;
    $scope.loggedInUserID = "";
    $scope.loggedInUserRealName = "";
    $scope.loggedInUserProfileImage = "";
    $scope.loggedInUserCleanUrl = "";
    $scope.target = "#signUpModal";
    $scope.projTarget = "#signUpModal";
    $scope.isOrg = false;
    $scope.isStudent = false;
    $scope.$apply();
  });

  $scope.$on('loggedInUserUpdated', function(event, userId) {
    data.getUser(userId, function(user){
      console.log("logged in User updated!", user);
      updateLoggedInScopes(user);
    });
  });

  $scope.$on('loggedInOrgUpdated', function(event, userId){
    data.getUser(userId, function(user){
      updateLoggedInScopes(user);
    });
  });

}])

.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    console.log(filtered);
    return filtered;
  };
})


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
    .when('/user/:cleanUrl/', {
      templateUrl: './app/userMain/userMain.html',
      controller: 'UserMainCtrl',
      controllerAs: 'vm',
      activetab: 'myprofile'
    })
    .when('/organization/:cleanUrl/', {
      templateUrl: './app/userMain/orgMain.html',
      controller: 'OrgMainCtrl',
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
