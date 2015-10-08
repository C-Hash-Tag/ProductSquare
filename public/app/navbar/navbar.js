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
    };
    $scope.$apply();
  };

  $scope.login = function(email, password) {
    auth.loginUser(email, password, loginCB);
  };


  $scope.logout = function(){
    auth.logout();
  };
}])

.controller('UserSignUpCtrl', ['$scope', function($scope){

}])

.controller('UserLoginCtrl', ['$scope', function($scope){
}])

.controller('DevProfileCompleteCtrl', ['$scope', function($scope){
  
  $scope.tempProfileImage = $scope.loggedInUserProfileImage;
  //before the userProfileImage is updated by this function, the initial state will be set on the app scope.
  $scope.updateUserProfileImage = function() { //when a user changes their profile pic, immediately upload it to AWS, and reset the localScope.
    imageUpload.userImage($scope.loggedInUserID, event, function(url){ //
      $scope.tempProfileImage = url;
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
      profileImage: $scope.tempProfileImage
    };
    data.updateUser($scope.loggedInUserID, newSettings);
    $('#devProfileCompleteModal').modal('hide'); //hide the signup modal.
  };

}]);
