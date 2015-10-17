angular.module('myApp', [
  'ngRoute',
  // 'ngResource',
  'myApp.data',
  'myApp.projectMain',
  'myApp.imageUpload',
  'myApp.main',
  'myApp.ideaMain',
  'myApp.firebase',
  'myApp.UserMain',
  'myApp.OrgMain',
  'myApp.auth',
  'myApp.navBar',
  'ngTagsInput',
  'myApp.firebase',
  'ngTagsInput',
  'ngResource',
  'myApp.projEditModal',
  'myApp.userContactModal'
])

//montiors stores top-level data for all of the pages on the entire app. maybe add ngResource
.controller('AppController', ['$scope', 'data', 'auth', '$route', '$q', '$filter', '$location', function($scope, data, auth, $route, $q, $filter, $location) {

  $scope.isActive = function(route) {
    return route === $location.path();
  };

  $scope.$on('$locationChangeStart', function(event, next, current){            
    //hide all modals on back button.
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  });
  $scope.$on('$routeChangeStart', function(event, next, current){            
    //hide all modals on back button.
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  });

  $scope.tags = [
    { text: 'HTML' },
    { text: 'CSS' },
    { text: 'JavaScript' }
  ];

  $scope.loadTags = function(query) {
    // return tags.query().$promise;
    var deferred = $q.defer();
    var autoCompleteTags =
    [
      { "text": "HTML" },
      { "text": "CSS" },
      { "text": "JavaScript" },
      { "text": "AngularJS" },
      { "text": "ReactJS" },
      { "text": "NodeJS" },
      { "text": "MongoDB" },
      { "text": "Ruby" },
      { "text": "Rails" },
      { "text": "SQL" },
      { "text": "Firebase" },
      { "text": "BackboneJS" },
      { "text": "EmberJS" },
      { "text": "Swift" },
      { "text": "Java" },
      { "text": "Objective-C" },
      { "text": "Python" },
      { "text": "Django" },
      { "text": "Scala" },
      { "text": "C++" },
      { "text": "C" },
      { "text": "C#" }
    ];
    deferred.resolve($filter('filter')(autoCompleteTags, {text: query}));
    return deferred.promise;
  };

  $scope.target = "#signUpModal"; //if an organization has not logged in or not signed in, the default is that they will be sent to signUp modal when they want to submit a proposal
  $scope.projTarget = "#signUpModal";

  var updateLoggedInScopes = function(user){
    $scope.loggedIn = true;
    $scope.loggedInUser = user;
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
    //create initial array of teamMembers for new project submission.

    $scope.newProjTeamMembers = [user.userId];
    $scope.newProjTeamMemberObjects = [user];
    $scope.$apply();
    console.log("inside app.js ",  $scope.loggedInUserCleanUrl, user.cleanUrl)
  };

  //if the localStorage userID is set, retrieve that user using the data.getUser method
  if (localStorage.userID){
    //get the logged in users ideas.
    // data.getLoggedInUsersIdeas(localStorage.userID, function(ideasSubmitted){
    //   $scope.loggedInUserIdeas = ideasSubmitted
    //   $scope.$apply();
    // });

    //get the signed in users data.
    data.getUser(localStorage.userID, function(user){
      console.log("userLoggedIn", user);
      updateLoggedInScopes(user);
      $scope.$broadcast("userFoundInLocal");
    });
  }

  data.getProjects(function(projects){
    $scope.newProjects = _.values(projects);
    $scope.$apply();
  });

  data.getIdeas(function(ideas){
    $scope.newIdeas = _.values(ideas);
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
  });

  $scope.$on('loggedInUserUpdated', function(event, userId) {
    data.getUser(userId, function(user){
      console.log("logged in User updated!", user);
      updateLoggedInScopes(user);
    });
  });

  $scope.$on('loggedInOrgUpdated', function(event, userId){
    data.getUser(userId, function(user){
      console.log("logged In ORg UPDATEDDD!!", user);
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
      css: './app/ideaMain/ideaMain.css'
    })
    .when('/user/:cleanUrl/', {
      templateUrl: './app/userMain/userMain.html',
      controller: 'UserMainCtrl',
      controllerAs: 'vm'
    })
    .when('/organization/:cleanUrl/', {
      templateUrl: './app/userMain/orgMain.html',
      controller: 'OrgMainCtrl',
      controllerAs: 'vm'
    })
    .when('/projects', {
      templateUrl: './app/projectMain/projectMain.html',
      controller:'ProjectMainCtrl',
      controllerAs: 'vm'
    });
}])

//--> for testing purposes
.factory('firebaseMock', [function(){
  var factory = {};
  var Ref = new Firebase('https://popping-heat-272.firebaseio.com/');

  factory.createUser = function(name, age, orgnaization){
    // Store the project data in Firebase
    Ref.child(name).set({
      name: name,
      age: age,
      orgnaization: orgnaization
    });
  };
  return factory;
}])

.factory('basicService', function(firebaseMock){
  var factory = {};
  factory.sendData = function(name, age, orgnaization){
    firebaseMock.createUser(name, age, orgnaization);
  }
  return factory;
});

