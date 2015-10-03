angular.module("myApp").directive("navBar", ['$window', "auth", "data", "imageUpload", function($window, auth, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      auth.authLogin(scope);
      
      //put the newuserSubmit function here.
      scope.newUserSubmit = function(realName, email, password) {
        auth.newUser(realName, email, password, scope);
      };

      scope.fileNameChanged = function() {
        console.log("selectedFile!!!");
        console.log("event", event);
        imageUpload.userImage("dswright", event, function(url){
          scope.userProfileImage = url;
          scope.$apply();
        }); //run the userImage upload from the imageUpload factory.
      };

      scope.$on('userCreated', function (event, user){ //when a user is created
        $('#signUpModal').modal('hide'); //hide the signup modal.
        $('#profileImageModal').modal('show'); //show the uploadImage modal.
        console.log("user created!", user);
        scope.userProfileImage = user.profileImage; //set profileimage to default image to start.
        scope.$apply();
      });

      scope.close = function() {
        scope.submission = false;
      };
      scope.login = function(email, password) {
        auth.authWithPass(email, password, scope);
      };
    
      scope.logout = function(){
        scope.loggedIn = false;
        auth.logout();
      };
    }
  }
}])


