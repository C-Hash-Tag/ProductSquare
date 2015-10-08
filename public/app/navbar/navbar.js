angular.module('myApp.navBar', [])


.controller('NavBarCtrl', ['$scope', 'data', 'auth', 'imageUpload', '$location', function($scope, data, auth, imageUpload, $location) {

  //NavBar html is contained within the index.html file.
  $scope.loginCB = function(error, authData, email){
    if (error) {
      $scope.loginErrorFound = true;
      $scope.loginError = "Sorry! The email/password is incorrect, please try again."
    } else {
      $('#loginModal').modal('hide');
      
      //reset the login modal fields to blank.
      // $scope.password=""; //these fields need to be reset to blank on the login modal controller, not here.
      // $scope.email="";
      $scope.loginErrorFound = false;
      $scope.loginError = "";

      data.getUser(authData.uid, function(user){
        console.log("USERTO LOGIN", user);
        $scope.$emit('userLoggedIn', user);
      });
      localStorage.userID = authData.uid;
    };
    $scope.$apply();
  };

  $scope.logout = function(){
    auth.logout();
  };
}])

.controller('UserSignUpCtrl', ['$scope', 'auth', 'data', function($scope, auth, data){
  //put the newuserSubmit function here.
  $scope.createUser = function(realName, email, password, iamThis, orgName, orgLink, orgDesc, orgRepTitle, orgLogoImage, orgLoc) {
    console.log("user creation started!");
    console.log(iamThis);
    if (password === "" || password === undefined) {
      $scope.errorFound = true;
      $scope.error = "please enter a password!";
    }
    else if(!iamThis){
      $scope.errorFound = true;
      $scope.error = "please select student developer or organization";
    }
    else {
      if (realName === "" || realName === undefined){
        $scope.errorFound = true;
        $scope.error = "please enter your name!";
      }
      else {
        auth.newUser(realName, email, password, function(error, userData){
          if (error) {
            $scope.errorFound = true;
            switch (error.code) {
              case "EMAIL_TAKEN":
                $scope.error = "The new user account cannot be created because the email is already in use.";
                break;
              case "INVALID_EMAIL":
                $scope.error = "The specified email is not a valid email.";
                break;
              default:
                $scope.error = "Error creating user:" + error;
            }
          } else {
            //create a full user in the firebase database.
            data.createUser(email, password, userData.uid, realName, iamThis, function(){
              //switch the modals that appear when a user is successfully created.
              $('#signUpModal').modal('hide');
              if(iamThis === "organization"){
                $('#finishOrgProfileModal').modal('show');
              }
              else{
                $('#devProfileCompleteModal').modal('show');
              }
              //after creating the user, login the user.
              auth.loginUser(email, password, $scope.loginCB);
            }, orgName, orgLink, orgDesc, orgRepTitle, orgLogoImage, orgLoc);
          }
          $scope.$apply();
        });
      }
    }  
  };
}])

.controller('UserLoginCtrl', ['$scope', 'auth', function($scope, auth){
    $scope.login = function(email, password) {
      auth.loginUser(email, password, $scope.loginCB);
    };
}])

.controller('DevProfileCompleteCtrl', ['$scope', 'imageUpload', 'data', function($scope, imageUpload, data){
  
  //before the userProfileImage is updated by this function, the initial state will be set on the app scope.
  $scope.updateUserProfileImage = function() { //when a user changes their profile pic, immediately upload it to AWS, and reset the localScope.
    imageUpload.userImage($scope.loggedInUserID, event, function(url){ //
      $scope.loggedInUserProfileImage = url;
      $scope.$apply();
    });
  };

  //this function saves the additional profile attributes. The name needs to be updated.
  $scope.finishDevProfile = function(githubLink, linkedinLink, blogLink, location, school) {
    var newSettings = {
      github: githubLink || "",
      linkedin: linkedinLink || "",
      blog: blogLink || "",
      location: location || "",
      school: school || "",
      profileImage: $scope.loggedInUserProfileImage //loggedInUserProfileImage is set in the app.js when user logs in. Can be reset here if new pic is selected.
    };
    data.updateUser($scope.loggedInUserID, newSettings);
    $('#devProfileCompleteModal').modal('hide'); //hide the signup modal.
  };

}]);
