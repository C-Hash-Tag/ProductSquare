angular.module('myApp.navBar', [])


.controller('NavBarCtrl', ['$scope', 'data', 'auth', 'imageUpload', '$location', function($scope, data, auth, imageUpload, $location) {

  //NavBar html is contained within the index.html file.
  var loginCB = function(error, authData, email){
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
      localStorage.email = email;
    };
    $scope.$apply();
  };

  $scope.login = function(email, password) {
    auth.loginUser(email, password, loginCB);
  };

  //put the newuserSubmit function here.
  $scope.createUser = function(realName, email, password) {
    console.log("user creation started!");
    if (password === "" || password === undefined) {
      $scope.errorFound = true;
      $scope.error = "please enter a password!";
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
            data.createUser(email, password, userData.uid, realName, function(){
              
              //switch the modals that appear when a user is successfully created.
              $('#signUpModal').modal('hide');
              $('#finishProfileModal').modal('show');
              //after creating the user, login the user.
              auth.loginUser(email, password, loginCB);
            });

            
          }
          $scope.$apply();
        });
      }
    }
    
  };

  $scope.logout = function(){
    auth.logout();
  };
}])

.controller('UserSignUpCtrl', ['$scope', function($scope){
}])

.controller('UserLoginCtrl', ['$scope', function($scope){
}])

.controller('FinishProfileCtrl', ['$scope', function($scope){
  
  //this function updates the profile picture in the preview state. Not on the app scope.
  //before the userProfileImage is updated by this function, the initial state will be set on the app scope.
  $scope.uploadUserProfileImage = function() {
    console.log("selectedFile!!!");
    console.log("event", event);
    imageUpload.userImage($scope.loggedInUserID, event, function(url){
      $scope.userProfileImage = url;
      $scope.$apply();
    }); //run the userImage upload from the imageUpload factory.
  };

  //this function saves the additional profile attributes. The name needs to be updated.
  $scope.saveUserImage = function() {
    console.log("saving image in scope..!");
    data.setUserProfileImage(scope.userProfileImage, localStorage.userID);
    $('#profileImageModal').modal('hide'); //hide the signup modal.
    $('#profileCompleteModal').modal('show'); //show the uploadImage modal.
  };
}]);
