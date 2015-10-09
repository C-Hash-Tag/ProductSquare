angular.module('myApp.UserMain', [])

.controller('OrgMainCtrl', ['$scope', '$http', 'data', '$routeParams', 'imageUpload', function($scope, $http, data, $routeParams, imageUpload){

  var truncateText = function(text) {
    if (text !== undefined) {
      var returnText = text;
      if (text.indexOf("www.") > -1){
        returnText = returnText.replace("www.", "");
      }
      if (text.indexOf("http://") > -1){
        returnText = returnText.replace("http://", "");
      }
      if (text.indexOf("https://") > -1){
        returnText = returnText.replace("https://", "");
      }
      if (returnText.length > 23) {
        returnText = returnText.slice(0,23)+"...";
      }
      return returnText;
    }
  }


  $scope.stringFound = function(text) {
    if (text !== "" && text != undefined) {
      console.log("stringfound,", text);
      return true;
    } else {
      return false;
    }
  }

  userPageLoadScopes = function(user){
    $scope.realName = user.realName;
    $scope.profileImage = user.profileImage;
    $scope.tempProfileImage = user.profileImage; //set the temp profile image to the userimage. This is used for the user edit modal.
    $scope.githubLink = user.github;
    $scope.githubText = truncateText(user.github);
    $scope.blogLink = user.blog;
    $scope.blogText = truncateText(user.blog);
    $scope.linkedinLink = user.linkedin;
    $scope.linkedinText = truncateText(user.linkedin);
    $scope.location = truncateText(user.location);
    $scope.school = truncateText(user.school);
    $scope.$apply();
  };

  //fetch the userData based on the routeID to generate the
  data.getUser($routeParams.userID, userPageLoadScopes);

  $scope.$on("loggedInUserUpdated", function(event, user){
    data.getUser(user, userPageLoadScopes);
  });

  //when browsing between pages, the loggedInUserID will be inherited from app.js
  if ($scope.loggedInUserID === $routeParams.userID) {
    console.log("edible!");
    $scope.edible = true;
  }

  //when the userID is found in localStorage, set edible to true.
  //userFoundInLocal is broadcast from app.js
  $scope.$on('userFoundInLocal', function(event, data){
    if ($scope.loggedInUserID === $routeParams.userID){
      console.log("edible!");
      $scope.edible = true;
      $scope.$apply();
    }
  });

  //user logs in while on the user profile page. Set edible to true.
  //userNowLoggedIn is broadcast from app.js
  $scope.$on('userNowLoggedIn', function(event){
    if ($scope.loggedInUserID === $routeParams.userID){
      console.log("edible!");
      $scope.edible = true;
      $scope.$apply();
    }
  });

  //if the user logs out while on the user page, set the scope edible to false.
  //userLoggedOut is broadcast from app.js
  $scope.$on('userLoggedOut', function(event, data){
    $scope.edible = false;
  });

  //probably the wrong scope.
  $scope.sendEmail = function(message) {
    $('#contactModal').modal('hide'); //use jQuery to hide the modal when the submit email button his hit.
    console.log("in sendMail");
    $http.post('/email', {
      email: "dylansamuelwright@gmail.com", //to be populated from the factory.
      message: message,
      username: "Dylan" //to be populated from the factory.
    }).
    then(function(response) {
      console.log("email sent");
    }, function(response) {
      console.log("email error");
    });
  }

}])

.controller('ProfileEditCtrl', ['$scope', 'data', 'imageUpload', function($scope, data, imageUpload){
  //wrong scope. belongs on the profileEdit scope.
  $scope.updateUserProfileImage = function(){
    console.log("event", event);
    imageUpload.userImage($scope.loggedInUserID, event, function(url){
      $scope.tempProfileImage = url;
      $scope.$apply();
    });
  };

  //wrong scope. This needs to emit an event to the parent scope.
  $scope.updateUserProfile = function(realName, github, linkedin, blog, location, school) {
    console.log("user profile updated!");
    var newSettings = {
      realName: realName || "",
      github: github || "",
      linkedin: linkedin || "",
      blog: blog || "",
      location: location || "",
      school: school || "",
      profileImage: $scope.tempProfileImage
    };
    console.log($scope.loggedInUserID);
    data.updateLoggedInUser($scope.loggedInUserID, newSettings);
    $('#profile-edit-modal').modal('hide');
  }

}]);
