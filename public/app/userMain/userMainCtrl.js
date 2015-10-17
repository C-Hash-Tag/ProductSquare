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
      return true;
    } else {
      return false;
    }
  }

  var userPageLoadScopes = function(user){
    console.log("user", user)
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
    $scope.skills = user.skills;
    $scope.overview = user.overview;
    $scope.projects = user.projects;

    $scope.projEditObj = {prop: "Hello"}
    $scope.projectObjects = [];

    //CONTACT USER MODAL LOADING
    $scope.userContactObj = {
      realName: user.realName,
      email: user.email,
    };

    //handles updating projects on user page: prevents duplicate projects on edit
    if (user.projects){
      for (var i=0; i<user.projects.length; i++){
        data.getProject(user.projects[i], function(projectObject){
          console.log("projectsObs", $scope.projectObjects);

          var foundAt;
          var found = false;
          for (var i=0; i<$scope.projectObjects.length; i++){
            if ($scope.projectObjects[i].projID === projectObject.projID){
              found = true;
              foundAt = i;
            }
          }
          if (found){
            $scope.projectObjects[foundAt] = projectObject;
          }
          else {
            $scope.projectObjects.push(projectObject);
          }
        });
      }
    }

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

  //HANDLES TRIGGERING PROJECT MODALS
  // $scope.passit = function(projName, description, projUrl, githubRepo, projectImage, date, projID, teamMembers){
  //   console.log("passing it!!!", projName, description);
  //   $scope.specificProjName = projName;
  //   $scope.specificDescription = description;
  //   $scope.specificProjUrl = projUrl;
  //   $scope.specificGithubRepo = githubRepo;
  //   $scope.specificProjectImage = projectImage;
  //   $scope.specificDate = date;
  //   $scope.specificProjID  = projID;
  //   $scope.specificTeamMembers = teamMembers;
  //   $scope.specificTeamMemberObjects = [];
  //   $scope.specificTeamMembersRemoved = [];
  //   if (teamMembers !== undefined){
  //     for(var i=0; i < teamMembers.length; i++){
  //       data.getUser(teamMembers[i], function(user){
  //         $scope.specificTeamMemberObjects.push(user);
  //         $scope.$apply();
  //       })
  //     }
  //   }
  // }

  $scope.passit = function(projName, description, projUrl, githubRepo, projectImage, date, projID, teamMembers, loggedInUserID){
    $scope.projEditObj = {
      loggedInUserID: loggedInUserID,
      editProj: false,
      projName: projName,
      description: description,
      projUrl: projUrl,
      githubRepo: githubRepo,
      projectImage: projectImage,
      date: date,
      projID: projID,
      teamMembers: teamMembers,
      teamMemberObjects: [],
      teamMembersRemoved: [],
    }
    console.log(teamMembers, "teamMembers!");
    if (teamMembers !== undefined){
      for(var i=0; i <teamMembers.length; i++){
        if (teamMembers[i] === $scope.projEditObj.loggedInUserID){
          $scope.projEditObj.editProj = true;
        }
        data.getUser(teamMembers[i], function(user){
          console.log(user);
          $scope.projEditObj.teamMemberObjects.push(user);
        });
      }
      
    }
    
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

  $scope.updateUserProfile = function(realName, overview, github, linkedin, blog, location, school, cleanUrl, skills) {

    var urlCleaner = cleanUrl.replace(/[^0-9a-z-]/g,""); //apply the urlCleaning function to the clean url.

    var newSettings = {
      realName: realName || "",
      overview: overview || "",
      github: github || "",
      linkedin: linkedin || "",
      blog: blog || "",
      location: location || "",
      school: school || "",
      cleanUrl: urlCleaner,
      skills: skills || "",
      profileImage: $scope.tempProfileImage
    };

    //need to put in some form validation for the clean URL to check for dups and blanks.
    console.log("in user profile update");

    if (newSettings.github.indexOf("http://") === -1 && newSettings.github.indexOf("https://") === -1 && newSettings.github !== ""){
      console.log("github invalid");
      $scope.errorFound = true;
      $scope.error = "Please provide a complete link to your Github - 'https://github.com/user'";
    }
    else {
      if (newSettings.linkedin.indexOf("http://") === -1 && newSettings.linkedin.indexOf("https://") === -1 && newSettings.linkedin !== ""){
        $scope.errorFound = true;
        $scope.error = "Please provide a complete link to your LinkedIn profile - https://linkedin.com/in/name"
      }
      else {
        if (newSettings.blog.indexOf("http://") === -1 && newSettings.blog.indexOf("https://") === -1 && newSettings.blog !== ""){
          $scope.errorFound = true;
          $scope.error = "Please provide a complete link to your blog - 'http://blog.com'";
        }
        else {

          if (cleanUrl === "" || cleanUrl === undefined){
            console.log("clean URl is empty");
            $scope.errorFound = true;
            $scope.error = "Please provide a valid profile URL.";
          }
          else {
            console.log("running the ellse");
            data.getUserByCleanUrl(cleanUrl, function(user){

              //if a user is found, but the cleanUrl is the same as the loggedInCleanUrl, then that is fine.
              if (user.cleanUrl === $scope.loggedInUserCleanUrl){
                data.updateLoggedInUser($scope.loggedInUserID, newSettings, newSettings.cleanUrl);
                $('#profile-edit-modal').modal('hide');
              }
              else { //if this clean url is found, and not the current cleanUrl, then we should put out an error messagee!
                $scope.errorFound = true;
                $scope.error = "This profile url is already taken.";
                $scope.$apply();

                console.log("errorrrr, this url is in use!!")
              }

            }, function(error){ //if there is an error, then no user with this url was found, and it can be set for this user.
              data.updateLoggedInUser($scope.loggedInUserID, newSettings, newSettings.cleanUrl);
              $('#profile-edit-modal').modal('hide');
            });
          }
        }
      }
    }

  }

}]);


