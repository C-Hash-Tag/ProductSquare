angular.module('myApp.UserMain', [])

.controller('UserMainCtrl', ['$scope', '$http', 'data', '$routeParams', 'imageUpload', function($scope, $http, data, $routeParams, imageUpload){

  var truncateText = function(text) {
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


  $scope.stringFound = function(text) {
    if (text !== "") {
      return true;
    } else {
      return false;
    }
  }

  //fetch the userData based on the routeID to generate the 
  data.getUser($routeParams.userID, function(user) {
    console.log("got this user..");
    $scope.realName = user.name;
    $scope.profileImage = user.profileImage;
    $scope.tempProfileImage = user.profileImage; //set the temp profile image to the userimage. This is used for the user edit modal.
    $scope.githubLink = user.github;
    $scope.githubText = truncateText(user.github);
    $scope.blogLink = user.blog;
    $scope.blogText = truncateText(user.blog);
    $scope.linkedinLink = user.linkedin;
    $scope.linkedinText = truncateText(user.linkedin);
    $scope.location = truncateText(user.location);
    $scope.organization = truncateText(user.organization);
    $scope.$apply();
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

   //wrong scope. belongs on the profileEdit scope.
  $scope.updateUserProfileImage = function(){
    console.log("event", event);
    imageUpload.userImage($routeParams.userId, event, function(url){
      $scope.tempProfileImage = url;
      $scope.$apply();
    });
  };

  console.log("realName", $scope.realName)
  //wrong scope. This needs to emit an event to the parent scope.
  $scope.updateUserProfile = function(realName, github, linkedin, blog, location, organization) {
    console.log("user profile updated!");
    var newSettings = {
      name: realName || "",
      github: github || "",
      linkedin: linkedin || "",
      blog: blog || "",
      location: location || "",
      organization: organization || "",
      profileImage: $scope.tempProfileImage
    };
    if (github !== ""){
      $scope.githubText = truncateText(github);
    }
    if (linkedin !== ""){
      $scope.linkedinText = truncateText(linkedin);
    }
    if (blog !== ""){
      $scope.blogText = truncateText(blog);
    }
    if ($scope.tempProfileImage !== $scope.profileImage){
      $scope.profileImage = $scope.tempProfileImage;
    }
    data.updateUser($scope.loggedInUserId, newSettings);
    $('#profile-edit-modal').modal('hide');
  }


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

}]);

// .controller('ProfileEditCtrl', ['$scope', function($scope){
  

// }]);


