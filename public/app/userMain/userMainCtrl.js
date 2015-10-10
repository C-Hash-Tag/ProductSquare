angular.module('myApp.UserMain', [])

.controller('UserMainCtrl', ['$scope', '$http', 'data', '$routeParams', 'imageUpload', function($scope, $http, data, $routeParams, imageUpload){

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
    $scope.email = user.email;
    $scope.tempProfileImage = user.profileImage; //set the temp profile image to the userimage. This is used for the user edit modal.
    $scope.githubLink = user.github;
    $scope.githubText = truncateText(user.github);
    $scope.blogLink = user.blog;
    $scope.blogText = truncateText(user.blog);
    $scope.linkedinLink = user.linkedin;
    $scope.linkedinText = truncateText(user.linkedin);
    $scope.location = truncateText(user.location);
    $scope.school = truncateText(user.school);
    $scope.cleanUrl = user.cleanUrl;
    if ($scope.loggedInUserCleanUrl === $scope.cleanUrl){
      $scope.edible = true;
    }
    $scope.$apply();
  };

  //fetch the userData based on the routeID to generate the 
  //data.getUser($routeParams.userID, userPageLoadScopes);

  data.getUserByCleanUrl($routeParams.cleanUrl, userPageLoadScopes);

  $scope.$on("loggedInUserUpdated", function(event, userID){
    data.getUser(userID, userPageLoadScopes);
  });

  console.log("userCtrl updated!", $scope.loggedInUserCleanUrl, $routeParams.cleanUrl);
  //when browsing between pages, the loggedInUserID will be inherited from app.js
  if ($scope.loggedInUserCleanUrl === $routeParams.cleanUrl) {
    console.log("edible!");
    $scope.edible = true;
  }

  //when the userID is found in localStorage, set edible to true.
  //userFoundInLocal is broadcast from app.js
  $scope.$on('userFoundInLocal', function(event, data){
    if ($scope.loggedInUserCleanUrl === $routeParams.cleanUrl){
      console.log("edible!");
      $scope.edible = true;
      $scope.$apply();
    }
  });

  //user logs in while on the user profile page. Set edible to true.
  //userNowLoggedIn is broadcast from app.js
  $scope.$on('userNowLoggedIn', function(event){
    if ($scope.loggedInUserCleanUrl === $routeParams.cleanUrl){
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
      email: $scope.email, //to be populated from the factory.
      message: message,
      username: $scope.realName //to be populated from the factory.
    }).
    then(function(response) {
      console.log("email sent");
    }, function(response) {
      console.log("email error");
    });
  }

}])

.controller('UserProfileEditCtrl', ['$scope', 'data', 'imageUpload', function($scope, data, imageUpload){
  //wrong scope. belongs on the profileEdit scope.
  $scope.updateUserProfileImage = function(){
    console.log("event", event);
    imageUpload.userImage($scope.loggedInUserID, event, function(url){
      $scope.tempProfileImage = url;
      $scope.$apply();
    });
  };

  $scope.updateUserProfile = function(realName, github, linkedin, blog, location, school, cleanUrl) {
    
    //need to put in some form validation for the clean URL to check for dups and blanks.
    console.log("user profile updated!");
    var newSettings = {
      realName: realName || "",
      github: github || "",
      linkedin: linkedin || "",
      blog: blog || "",
      location: location || "",
      school: school || "",
      cleanUrl: cleanUrl,
      profileImage: $scope.tempProfileImage
    };

    console.log("newSettings", newSettings);
    data.updateLoggedInUser($scope.loggedInUserID, newSettings, newSettings.cleanUrl);
    $('#profile-edit-modal').modal('hide');
  }

}]);


