angular.module('myApp.OrgMain', [])

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

  $scope.proposalEdible = false;
  $scope.checked = true; //if user's current userId matches the idea's userId and this is true, then the edit button will show

  $scope.like = function(ideaSubmitterID, ideaID){
    //check if user already liked idea

    //update css of the like button
    //update the database
    data.updateLike($scope.loggedInUserID, ideaSubmitterID, ideaID, function(usersWhoLikeItCount){
      console.log("HERRRRRE", usersWhoLikeItCount);
    });
      //TODO: if username liked it before, remove her; if username hasn't, add her
      //add/ remove idea in user's liked ideas
  }

  $scope.editIdea = function(userID) {
    if ($scope.loggedInUserID === userID) {
      return true;
    }
  }

  $scope.editModal = function() {
    console.log("in the edit function", $scope.edible)
    // if ($scope.editProj(userID)) {
    $scope.checked = false;
    $scope.proposalEdible = true;
  }


  $scope.saveModal = function(ideaID, ideaDesc, ideaName, ideaImage){
    // firebase logic
    console.log("in the save function");
    $scope.proposalEdible = false;
    $scope.checked = true;
    data.updateIdea(localStorage.userID, ideaID, ideaDesc, ideaName, ideaImage);
  };

  $scope.closeModal = function(){
    $scope.proposalEdible = false;
    $scope.checked = true;
  }

  $scope.close = function() {
    $scope.submission = false;
  }

  //INFO MODAL LOADING
  $scope.passit = function(ideaName, description, backgroundPath, date, userID, ideaID){
    $scope.specificIdeaName = ideaName;
    $scope.specificDescription = description;
    $scope.specificBackgroundPath = backgroundPath;
    $scope.specificDate = date;
    $scope.specificUserID = userID;
    $scope.specificIdeaID = ideaID;
  }

  $scope.stringFound = function(text) {
    if (text !== "" && text != undefined) {
      console.log("stringfound,", text);
      return true;
    } else {
      return false;
    }
  }

  var userPageLoadScopes = function(user){
    console.log("iser in user page load scope", user);
    $scope.realName = user.realName; // Org Rep Name
    $scope.orgRepTitle = user.orgRepTitle; // Org Rep Title
    $scope.orgName = user.orgName;
    $scope.orgNameText = truncateText(user.orgName);
    $scope.email = user.email;
    $scope.orgDesc = user.orgDesc;
    $scope.profileImage = user.profileImage;
    $scope.tempProfileImage = user.profileImage; //set the temp profile image to the userimage. This is used for the user edit modal.
    $scope.orgLink = user.orgLink;
    $scope.orgLinkText = truncateText(user.orgLink);
    $scope.location = truncateText(user.orgLoc);
    $scope.school = truncateText(user.school);
    $scope.cleanUrl = user.cleanUrl;
    $scope.ideasThatIsubmitted = user.ideasThatIsubmitted;
    if ($scope.loggedInUserCleanUrl === $scope.cleanUrl){
      $scope.edible = true;
    }

    //CONTACT USER MODAL LOADING
    $scope.userContactObj = {
      realName: user.realName,
      email: user.email,
    };
    
    $scope.$apply();
    console.log("iser in user page load scope bottom", user);
  };

  //fetch the userData based on the routeID to generate the
  data.getUserByCleanUrl($routeParams.cleanUrl, userPageLoadScopes);

  $scope.$on("loggedInOrgUpdated", function(event, user){
    console.log("logged in user updaetd on org page");
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

.controller('OrgProfileEditCtrl', ['$scope', 'data', 'imageUpload', function($scope, data, imageUpload){
  $scope.updateUserProfileImage = function(){
    console.log("event", event);
    imageUpload.userImage($scope.loggedInUserID, event, function(url){
      $scope.tempProfileImage = url;
      $scope.$apply();
    });
  };

  $scope.updateUserProfile = function(realName, orgName, orgDesc, orgLink, location, cleanUrl) {
    var urlCleaner = cleanUrl.replace(/[^0-9a-z-]/g,""); //apply the urlCleaning function to the clean url.

    console.log("user profile updated!");
    var newSettings = {
      realName: realName || "",
      orgName: orgName || "",
      orgDesc: orgDesc || "",
      orgLink: orgLink || "",
      location: location || "",
      profileImage: $scope.tempProfileImage,
      cleanUrl: urlCleaner
    };
    if (newSettings.orgLink.indexOf("http://") === -1 && newSettings.orgLink.indexOf("https://") === -1 && newSettings.orgLink !== ""){
      $scope.errorFound = true;
      $scope.error = "Please provide a complete link to your organization - 'http://organziation.com'";
    }
    else {
      if (cleanUrl === "" || cleanUrl === undefined){
        console.log("clean URl is empty");
        $scope.error = "Please provide a valid profile URL.";
      }
      else {
        console.log("running the ellse");
        data.getUserByCleanUrl(cleanUrl, function(user){
          
          //if a user is found, but the cleanUrl is the same as the loggedInCleanUrl, then that is fine.
          if (user.cleanUrl === $scope.loggedInUserCleanUrl){
            data.updateOrg($scope.loggedInUserID, newSettings, newSettings.cleanUrl);
            $('#profile-edit-modal').modal('hide');
          }
          else { //if this clean url is found, and not the current cleanUrl, then we should put out an error messagee!
            $scope.errorFound = true;
            $scope.error = "This profile url is already taken.";
            $scope.$apply();
            console.log("errorrrr, this url is in use!!")
          }

        }, function(error){ //if there is an error, then no user with this url was found, and it can be set for this user.
          data.updateOrg($scope.loggedInUserID, newSettings, newSettings.cleanUrl);
          $('#profile-edit-modal').modal('hide');
        });
      }
    }
  }
}]);
